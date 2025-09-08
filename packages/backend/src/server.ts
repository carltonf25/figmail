import "dotenv/config";
import express from "express";
import cors from "cors";
import { json } from "express";
import session from "express-session";
import compileRouter from "./routes/compile.js";
import authRouter from "./routes/auth.js";

const app = express();

// Session configuration (must be before auth router)
app.use(session({
  secret: process.env.SESSION_SECRET || 'figchimp-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(cors({
  origin: ["http://localhost:3000", "https://www.figma.com"], // Add your domains
  credentials: true
}));
app.use(json({ limit: "25mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRouter);
app.use("/", compileRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on :${port}`));