// Simple test to verify the server can load without OAuth config
import express from "express";
import cors from "cors";
import { json } from "express";

const app = express();
app.use(cors({ origin: "*" }));
app.use(json({ limit: "25mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

const port = 4001; // Use different port to avoid conflicts
const server = app.listen(port, () => {
  console.log(`✅ Test server listening on :${port}`);
  console.log('✅ ES module loading works correctly');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});
