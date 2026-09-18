import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  extractResume,
  analyzeResume,
  getResumeHistory,
} from "../controllers/resumeController.js";

const router = express.Router();

// ==========================================
// RESUME TEXT EXTRACTION
// Temporary testing route
// ==========================================

router.post(
  "/extract",
  verifyToken,
  upload.single("resume"),
  extractResume
);

// ==========================================
// COMPLETE AI RESUME ANALYSIS
// ==========================================

router.post(
  "/analyze",
  verifyToken,
  upload.single("resume"),
  analyzeResume
);

// ==========================================
// GET USER RESUME ANALYSIS HISTORY
// ==========================================

router.get(
  "/history",
  verifyToken,
  getResumeHistory
);

export default router;