import axios from "axios";

function baseUrl() {
  const dc = process.env.MC_DC;
  console.log("DEBUG baseUrl() - MC_DC from env:", dc);
  console.log("DEBUG baseUrl() - All env vars:", Object.keys(process.env).filter(k => k.startsWith('MC_')));
  if (!dc) throw new Error("MC_DC is required (Mailchimp data center, e.g., us21)");
  const url = `https://${dc}.api.mailchimp.com/3.0`;
  console.log("DEBUG baseUrl() - Constructed URL:", url);
  return url;
}

function authHeader() {
  const access = process.env.MC_ACCESS_TOKEN;
  if (!access) throw new Error("MC_ACCESS_TOKEN is required (Mailchimp OAuth access token)");
  return { Authorization: `OAuth ${access}` };
}

export async function createOrUpdateTemplate(name: string, html: string): Promise<{ id: number }> {
  console.log("=== CREATING/UPDATING MAILCHIMP TEMPLATE ===");
  console.log("Template name:", name);
  console.log("HTML length:", html.length);
  
  try {
    // Find existing by name
    console.log("Fetching existing templates...");
    const listUrl = `${baseUrl()}/templates`;
    console.log("List templates URL:", listUrl);
    const list = await axios.get(listUrl, { headers: authHeader(), params: { count: 1000, type: "user" } });
    console.log("Found", list.data.templates.length, "existing templates");
    
    const existing = (list.data.templates as any[]).find(t => t.name === name);
    if (existing) {
      console.log("Updating existing template:", existing.id);
      const updateUrl = `${baseUrl()}/templates/${existing.id}`;
      console.log("Update template URL:", updateUrl);
      await axios.patch(updateUrl, { name, html }, { headers: authHeader() });
      return { id: existing.id };
    }
    
    console.log("Creating new template...");
    const createUrl = `${baseUrl()}/templates`;
    console.log("Create template URL:", createUrl);
    const created = await axios.post(createUrl, { name, html }, { headers: authHeader() });
    console.log("Template created successfully:", created.data.id);
    return { id: created.data.id };
  } catch (error: any) {
    console.error("Mailchimp template operation failed:");
    console.error("Status:", error.response?.status);
    console.error("Status Text:", error.response?.statusText);
    console.error("Error Data:", JSON.stringify(error.response?.data, null, 2));
    throw new Error(error.response?.data?.detail || error.response?.data?.title || error.message);
  }
}

export async function createDraftCampaign(opts: {
  listId: string;
  subject: string;
  fromName: string;
  replyTo: string;
  templateId?: number;
  fromEmail?: string;
}) {
  console.log("=== CREATING MAILCHIMP CAMPAIGN ===");
  console.log("Campaign options:", opts);
  
  const payload: any = {
    type: "regular",
    recipients: { list_id: opts.listId },
    settings: {
      subject_line: opts.subject,
      from_name: opts.fromName,
      reply_to: opts.replyTo,
      from_email: opts.fromEmail || opts.replyTo, // Use reply_to as from_email if not specified
      template_id: opts.templateId
    }
  };
  
  console.log("Campaign payload:", JSON.stringify(payload, null, 2));
  console.log("Mailchimp URL:", `${baseUrl()}/campaigns`);
  
  try {
    const resp = await axios.post(`${baseUrl()}/campaigns`, payload, { headers: authHeader() });
    console.log("Campaign created successfully:", resp.data.id);
    return resp.data;
  } catch (error: any) {
    console.error("Mailchimp campaign creation failed:");
    console.error("Status:", error.response?.status);
    console.error("Status Text:", error.response?.statusText);
    console.error("Error Data:", JSON.stringify(error.response?.data, null, 2));
    throw new Error(error.response?.data?.detail || error.response?.data?.title || error.message);
  }
}

export async function setCampaignContent(campaignId: string, html: string) {
  await axios.put(`${baseUrl()}/campaigns/${campaignId}/content`, { html }, { headers: authHeader() });
}
