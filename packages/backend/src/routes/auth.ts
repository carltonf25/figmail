import { Router } from "express";
import passport from "passport";
import { Strategy as OAuth2Strategy } from "passport-oauth2";
import axios from "axios";

const router = Router();

// Configure session middleware (should be done in main server.ts)
router.use(require('express-session')({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport
router.use(passport.initialize());
router.use(passport.session());

// Mailchimp OAuth2 Strategy
passport.use(new OAuth2Strategy({
  authorizationURL: 'https://login.mailchimp.com/oauth2/authorize',
  tokenURL: 'https://login.mailchimp.com/oauth2/token',
  clientID: process.env.MC_CLIENT_ID!,
  clientSecret: process.env.MC_CLIENT_SECRET!,
  callbackURL: process.env.MC_REDIRECT_URI!,
  scope: ['template', 'campaign', 'content', 'audience', 'filemanager']
},
async (accessToken: string, refreshToken: string, profile: any, done: Function) => {
  try {
    // Get metadata to determine datacenter
    const response = await axios.get('https://login.mailchimp.com/oauth2/metadata', {
      headers: { Authorization: `OAuth ${accessToken}` }
    });

    const userData = {
      accessToken,
      refreshToken,
      dc: response.data.dc,
      profile: profile
    };

    return done(null, userData);
  } catch (error) {
    return done(error);
  }
}));

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

// Routes
router.get("/mailchimp/start", passport.authenticate('oauth2'));

router.get("/mailchimp/callback",
  passport.authenticate('oauth2', { failureRedirect: '/auth/failed' }),
  (req, res) => {
    // Successful authentication
    const user = req.user as any;
    res.json({
      success: true,
      accessToken: user.accessToken,
      dc: user.dc,
      message: "Mailchimp connected successfully!"
    });
  }
);

router.get("/mailchimp/status", (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user as any;
    res.json({
      connected: true,
      dc: user.dc,
      hasAccessToken: !!user.accessToken
    });
  } else {
    res.json({ connected: false });
  }
});

router.post("/mailchimp/disconnect", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to disconnect" });
    }
    res.json({ success: true, message: "Disconnected from Mailchimp" });
  });
});

router.get("/mailchimp/user", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const user = req.user as any;
    const response = await axios.get(`https://${user.dc}.api.mailchimp.com/3.0/`, {
      headers: { Authorization: `OAuth ${user.accessToken}` }
    });

    res.json({
      account: response.data.account_name,
      total_subscribers: response.data.total_subscribers,
      dc: user.dc
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to fetch user info",
      details: error.response?.data
    });
  }
});

// Legacy routes for backward compatibility
router.get("/failed", (req, res) => {
  res.json({
    success: false,
    error: "OAuth authentication failed"
  });
});

export default router;