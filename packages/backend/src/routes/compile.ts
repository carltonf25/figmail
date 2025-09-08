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

    // Check authentication
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        error: "Not authenticated",
        message: "Please connect to Mailchimp first"
      });
    }

    const user = req.user as any;
    if (!user.accessToken || !user.dc) {
      return res.status(401).json({
        error: "Invalid authentication",
        message: "Mailchimp access token or datacenter missing"
      });
    }

    const ast: EmailAstType = parseEmailAst(req.body.ast);
    const images: Record<string, string> = req.body.images ?? {};
    const options = req.body;
    const templateName: string = options.templateName || ast.name || "Figma Template";
    const createCampaign: boolean = !!options.createCampaign;
    const listId: string | undefined = options.listId;
    const subject: string = options.subject || "Draft from Figma";
    const fromName: string = options.fromName || "Design";
    const replyTo: string = options.replyTo || process.env.DEFAULT_REPLY_TO || "no-reply@yourdomain.com";

    const mappedAst = await uploadAssetsAndRewrite(ast, images);
    const mjml = astToMjml(mappedAst);
    const { html } = mjml2html(replaceMergeTags(mjml), { validationLevel: "soft" });
    const inlined = juice(html);

    // Use OAuth tokens from session
    const tpl = await createOrUpdateTemplate(templateName, inlined, {
      accessToken: user.accessToken,
      dc: user.dc
    });

    let campaign = null;
    if (createCampaign) {
      if (!listId) throw new Error("listId is required to create a campaign");

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(replyTo)) {
        throw new Error(`Invalid reply_to email format: ${replyTo}`);
      }

      // Warn about placeholder domains
      if (replyTo.includes('example.com') || replyTo.includes('yourdomain.com')) {
        throw new Error(`Please configure a valid reply_to email. Current: ${replyTo}. Set DEFAULT_REPLY_TO in .env or pass replyTo in options.`);
      }

      campaign = await createDraftCampaign({
        listId,
        subject,
        fromName,
        replyTo,
        fromEmail: options.fromEmail || replyTo,
        templateId: tpl.id
      }, {
        accessToken: user.accessToken,
        dc: user.dc
      });

      // Ensure content is set (template may already contain HTML but we set for certainty)
      await setCampaignContent(campaign.id, inlined, {
        accessToken: user.accessToken,
        dc: user.dc
      });
    }

    res.json({
      templateId: tpl.id,
      templateUrl: `https://${user.dc}.admin.mailchimp.com/templates/edit?id=${tpl.id}`,
      campaignId: campaign?.id,
      campaignUrl: campaign ? `https://${user.dc}.admin.mailchimp.com/campaigns/edit?id=${campaign.id}` : null,
      success: true
    });

  } catch (e: any) {
    console.error("Compile and push error:", e);
    res.status(400).json({
      error: e.message,
      success: false
    });
  }
});

export default router;