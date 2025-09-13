import "dotenv/config";
import express from "express";
import cors from "cors";
import { json } from "express";
import session from "express-session";
import compileRouter from "./routes/compile.js";
import authRouter from "./routes/auth.js";
import { testS3Connection } from "./services/assets.js";

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
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin or null origin (like mobile apps, curl requests, iframes)
    if (!origin || origin === 'null') return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000",
      "https://www.figma.com",
      "https://figma.com",
      /^https:\/\/.*\.figma\.com$/
    ];

    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(json({ limit: "25mb" }));

app.get("/health", async (_req, res) => {
  // Basic health check
  const health = { ok: true, timestamp: new Date().toISOString() };
  res.json(health);
});

app.get("/health/s3", async (_req, res) => {
  try {
    const s3Status = await testS3Connection();
    res.json({
      service: "s3",
      status: s3Status.success ? "healthy" : "unhealthy",
      message: s3Status.message,
      timestamp: new Date().toISOString(),
      config: {
        bucket: process.env.S3_BUCKET || "not configured",
        region: process.env.AWS_REGION || "us-east-1",
        prefix: process.env.S3_PREFIX || "emails",
        cloudfront: process.env.CLOUDFRONT_DOMAIN || "not configured"
      }
    });
  } catch (error: any) {
    res.status(500).json({
      service: "s3",
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.use("/auth", authRouter);
app.use("/", compileRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on :${port}`));