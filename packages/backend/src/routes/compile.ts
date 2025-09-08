import { Router } from "express";
import mjml2html from "mjml";
import juice from "juice";
import { EmailAst as EmailAstSchema, EmailAst as EmailAstType, parseEmailAst } from "@figmc/shared";
import { astToMjml } from "../services/astToMjml.js";
import { replaceMergeTags } from "../services/mergeTags.js";
import { uploadAssetsAndRewrite } from "../services/assets.js";
import { createOrUpdateTemplate, createDraftCampaign, setCampaignContent } from "../services/mailchimp.js";
import { debugRequest } from "../utils/debug.js";

const router = Router();

/** Development helper: compile only */
router.post("/compile", async (req, res) => {
  try {
    const ast: EmailAstType = parseEmailAst(req.body.ast);
    const images: Record<string, string> = req.body.images ?? {};
    const mappedAst = await uploadAssetsAndRewrite(ast, images);
    const mjml = astToMjml(mappedAst);
    const { html } = mjml2html(replaceMergeTags(mjml), { validationLevel: "soft" });
    const inlined = juice(html);
    res.json({ mjml, html: inlined });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

/** MVP: compile + push to Mailchimp */
router.post("/compile-and-push", async (req, res) => {
  try {
    debugRequest(req);
    
    const ast: EmailAstType = parseEmailAst(req.body.ast);
    const images: Record<string, string> = req.body.images ?? {};
    const options = req.body.options ?? {};
    const templateName: string = options.templateName || ast.name || "Figma Template";
    const createCampaign: boolean = !!options.createCampaign;
    const listId: string | undefined = options.listId;
    const subject: string = options.subject || "Draft from Figma";
    const fromName: string = options.fromName || "Design";
    const replyTo: string = options.replyTo || "no-reply@example.com";

    const mappedAst = await uploadAssetsAndRewrite(ast, images);
    const mjml = astToMjml(mappedAst);
    const { html } = mjml2html(replaceMergeTags(mjml), { validationLevel: "soft" });
    const inlined = juice(html);

    const tpl = await createOrUpdateTemplate(templateName, inlined);

    let campaign = null;
    if (createCampaign) {
      if (!listId) throw new Error("listId is required to create a campaign");
      campaign = await createDraftCampaign({ listId, subject, fromName, replyTo, templateId: tpl.id });
      // Ensure content is set (template may already contain HTML but we set for certainty)
      await setCampaignContent(campaign.id, inlined);
    }

    res.json({
      templateId: tpl.id,
      campaignId: campaign?.id || null,
      mjml,
      html: inlined
    });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

export default router;
