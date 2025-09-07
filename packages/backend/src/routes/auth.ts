import { Router } from "express";
import axios from "axios";

const router = Router();

const AUTH_URL = "https://login.mailchimp.com/oauth2/authorize";
const TOKEN_URL = "https://login.mailchimp.com/oauth2/token";
const META_URL = "https://login.mailchimp.com/oauth2/metadata";

router.get("/mailchimp/start", (req, res) => {
  const url = `${AUTH_URL}?response_type=code&client_id=${process.env.MC_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.MC_REDIRECT_URI!)}&scope=template campaign content audience filemanager`;
  res.redirect(url);
});

router.get("/mailchimp/callback", async (req, res) => {
  const code = req.query.code as string;
  const token = await axios.post(TOKEN_URL, {
    grant_type: "authorization_code",
    client_id: process.env.MC_CLIENT_ID,
    client_secret: process.env.MC_CLIENT_SECRET,
    redirect_uri: process.env.MC_REDIRECT_URI,
    code
  });
  const access = token.data.access_token as string;
  const meta = await axios.get(META_URL, { headers: { Authorization: `OAuth ${access}` } });
  // In a real app, you'd persist token + meta.data.dc (datacenter) by user.
  // For MVP, return these as a one-time payload to the plugin or dashboard.
  res.json({ access_token: access, dc: (meta.data as any).dc });
});

export default router;
