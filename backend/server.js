import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { db } from "./config/firebase.js";

import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import skillGapRoutes from "./routes/skillGapRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import mockInterviewRoutes from "./routes/mockInterviewRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/skill-gap", skillGapRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/mock-interview", mockInterviewRoutes);
// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillBridge AI Backend is running",
  });
});

// ==========================================
// FIREBASE CONNECTION TEST
// ==========================================

app.get("/api/firebase-test", async (req, res) => {
  try {
    await db.ref("backendTest").set({
      message: "Firebase connected successfully",
      status: "working",
      timestamp: Date.now(),
    });

    res.status(200).json({
      success: true,
      message:
        "Firebase connected and data saved successfully",
    });
  } catch (error) {
    console.error("Firebase Error:", error);

    res.status(500).json({
      success: false,
      message: "Firebase connection failed",
      error: error.message,
    });
  }
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(
    `SkillBridge AI Backend running on port ${PORT}`
  );
});