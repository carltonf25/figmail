import "dotenv/config";
import express from "express";
import cors from "cors";
import { json } from "express";
import compileRouter from "./routes/compile.js";
import authRouter from "./routes/auth.js";

const app = express();
app.use(cors({ origin: "*" }));
app.use(json({ limit: "25mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRouter);
app.use("/", compileRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on :${port}`));
