import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

import { handleChat } from "./server/routes/chat.js";
import { handleResearch } from "./server/routes/research.js";
import { handlePdfAnalyze, handlePdfChat } from "./server/routes/pdf.js";
import { handleGenerateStudyPlan } from "./server/routes/studyPlan.js";
import { handleCareerGuidance } from "./server/routes/career.js";
import { handleGenerateQuiz } from "./server/routes/quiz.js";
import { handleGetResources } from "./server/routes/resources.js";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // JSON payload parser with generous limit for PDF base64 payloads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "EduMentor AI Server",
      port: PORT,
      timestamp: new Date().toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
    });
  });

  // AI & Educational Endpoints
  app.post("/api/chat", handleChat);
  app.post("/api/research", handleResearch);
  app.post("/api/pdf/analyze", handlePdfAnalyze);
  app.post("/api/pdf/chat", handlePdfChat);
  app.post("/api/study-plan", handleGenerateStudyPlan);
  app.post("/api/career", handleCareerGuidance);
  app.post("/api/quiz", handleGenerateQuiz);
  app.get("/api/resources", handleGetResources);

  // Production vs development detection
  const isProduction =
    process.env.NODE_ENV === "production" ||
    Boolean(process.env.K_SERVICE) ||
    Boolean(process.env.K_REVISION) ||
    Boolean(process.argv[1] && process.argv[1].endsWith("server.cjs"));

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: "0.0.0.0",
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = fs.existsSync(path.join(process.cwd(), "dist", "index.html"))
      ? path.join(process.cwd(), "dist")
      : process.cwd();
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduMentor AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
