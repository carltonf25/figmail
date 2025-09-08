import axios from "axios";

interface OAuthCredentials {
  accessToken: string;
  dc: string;
}

// Helper functions for OAuth
function baseUrl(credentials: OAuthCredentials) {
  const { dc } = credentials;
  if (!dc) throw new Error("DC is required (Mailchimp data center, e.g., us21)");
  return `https://${dc}.api.mailchimp.com/3.0`;
}

function authHeader(credentials: OAuthCredentials) {
  const { accessToken } = credentials;
  if (!accessToken) throw new Error("Access token is required");
  return { Authorization: `OAuth ${accessToken}` };
}

// Legacy functions for backward compatibility (use env vars)
function legacyBaseUrl() {
  const dc = process.env.MC_DC;
  console.log("DEBUG baseUrl() - MC_DC from env:", dc);
  console.log("DEBUG baseUrl() - All env vars:", Object.keys(process.env).filter(k => k.startsWith('MC_')));
  if (!dc) throw new Error("MC_DC is required (Mailchimp data center, e.g., us21)");
  const url = `https://${dc}.api.mailchimp.com/3.0`;
  console.log("DEBUG baseUrl() - Constructed URL:", url);
  return url;
}

function legacyAuthHeader() {
  const access = process.env.MC_ACCESS_TOKEN;
  if (!access) throw new Error("MC_ACCESS_TOKEN is required (Mailchimp OAuth access token)");
  return { Authorization: `OAuth ${access}` };
}

export async function createOrUpdateTemplate(
  name: string,
  html: string,
  credentials?: OAuthCredentials
): Promise<{ id: number }> {
  console.log("=== CREATING/UPDATING MAILCHIMP TEMPLATE ===");
  console.log("Template name:", name);
  console.log("HTML length:", html.length);

  try {
    // Use OAuth credentials if provided, otherwise fall back to env vars
    const base = credentials ? baseUrl(credentials) : legacyBaseUrl();
    const auth = credentials ? authHeader(credentials) : legacyAuthHeader();

    // Find existing by name
    console.log("Fetching existing templates...");
    const listUrl = `${base}/templates`;
    console.log("List templates URL:", listUrl);
    const list = await axios.get(listUrl, {
      headers: auth,
      params: { count: 1000, type: "user" }
    });
    console.log("Found", list.data.templates.length, "existing templates");

    const existing = list.data.templates.find((t: any) => t.name === name);
    console.log("Existing template found:", !!existing);

    if (existing) {
      // Update existing template
      console.log("Updating existing template:", existing.id);
      const updateUrl = `${base}/templates/${existing.id}`;
      console.log("Update URL:", updateUrl);
      await axios.patch(updateUrl, {
        name,
        html
      }, { headers: auth });
      console.log("Template updated successfully");
      return { id: existing.id };
    } else {
      // Create new template
      console.log("Creating new template");
      const createUrl = `${base}/templates`;
      console.log("Create URL:", createUrl);
      const result = await axios.post(createUrl, {
        name,
        html
      }, { headers: auth });
      console.log("Template created successfully:", result.data.id);
      return { id: result.data.id };
    }
  } catch (error: any) {
    console.error("Template creation/update error:", error.response?.data || error.message);
    throw new Error(`Mailchimp template error: ${error.response?.data?.detail || error.message}`);
  }
}

export async function createDraftCampaign(
  opts: {
    listId: string;
    subject: string;
    fromName: string;
    replyTo: string;
    fromEmail: string;
    templateId: number;
  },
  credentials?: OAuthCredentials
): Promise<{ id: string; web_id: number }> {
  console.log("=== CREATING MAILCHIMP CAMPAIGN ===");
  console.log("Campaign options:", opts);

  try {
    const base = credentials ? baseUrl(credentials) : legacyBaseUrl();
    const auth = credentials ? authHeader(credentials) : legacyAuthHeader();

    const payload = {
      type: "regular",
      recipients: {
        list_id: opts.listId
      },
      settings: {
        subject_line: opts.subject,
        from_name: opts.fromName,
        reply_to: opts.replyTo,
        template_id: opts.templateId
      }
    };

    console.log("Campaign payload:", JSON.stringify(payload, null, 2));
    const createUrl = `${base}/campaigns`;
    console.log("Create campaign URL:", createUrl);

    const result = await axios.post(createUrl, payload, { headers: auth });
    console.log("Campaign created successfully:", result.data.id);

    return { id: result.data.id, web_id: result.data.web_id };
  } catch (error: any) {
    console.error("Campaign creation error:", error.response?.data || error.message);
    throw new Error(`Mailchimp campaign error: ${error.response?.data?.detail || error.message}`);
  }
}

export async function setCampaignContent(
  campaignId: string,
  html: string,
  credentials?: OAuthCredentials
): Promise<void> {
  console.log("=== SETTING CAMPAIGN CONTENT ===");
  console.log("Campaign ID:", campaignId);

  try {
    const base = credentials ? baseUrl(credentials) : legacyBaseUrl();
    const auth = credentials ? authHeader(credentials) : legacyAuthHeader();

    const contentUrl = `${base}/campaigns/${campaignId}/content`;
    console.log("Set content URL:", contentUrl);

    await axios.put(contentUrl, {
      html
    }, { headers: auth });

    console.log("Campaign content set successfully");
  } catch (error: any) {
    console.error("Set campaign content error:", error.response?.data || error.message);
    throw new Error(`Mailchimp content error: ${error.response?.data?.detail || error.message}`);
  }
}