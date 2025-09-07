import axios from "axios";

function baseUrl() {
  const dc = process.env.MC_DC;
  if (!dc) throw new Error("MC_DC is required (Mailchimp data center, e.g., us21)");
  return `https://${dc}.api.mailchimp.com/3.0`;
}

function authHeader() {
  const access = process.env.MC_ACCESS_TOKEN;
  if (!access) throw new Error("MC_ACCESS_TOKEN is required (Mailchimp OAuth access token)");
  return { Authorization: `OAuth ${access}` };
}

export async function createOrUpdateTemplate(name: string, html: string): Promise<{ id: number }> {
  // Find existing by name
  const list = await axios.get(`${baseUrl()}/templates`, { headers: authHeader(), params: { count: 1000, type: "user" } });
  const existing = (list.data.templates as any[]).find(t => t.name === name);
  if (existing) {
    await axios.patch(`${baseUrl()}/templates/${existing.id}`, { name, html }, { headers: authHeader() });
    return { id: existing.id };
  }
  const created = await axios.post(`${baseUrl()}/templates`, { name, html }, { headers: authHeader() });
  return { id: created.data.id };
}

export async function createDraftCampaign(opts: {
  listId: string;
  subject: string;
  fromName: string;
  replyTo: string;
  templateId?: number;
}) {
  const payload: any = {
    type: "regular",
    recipients: { list_id: opts.listId },
    settings: {
      subject_line: opts.subject,
      from_name: opts.fromName,
      reply_to: opts.replyTo,
      template_id: opts.templateId
    }
  };
  const resp = await axios.post(`${baseUrl()}/campaigns`, payload, { headers: authHeader() });
  return resp.data;
}

export async function setCampaignContent(campaignId: string, html: string) {
  await axios.put(`${baseUrl()}/campaigns/${campaignId}/content`, { html }, { headers: authHeader() });
}
