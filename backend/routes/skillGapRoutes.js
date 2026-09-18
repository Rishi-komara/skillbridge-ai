import express from "express";
import verifyToken from "../middleware/authMiddleware.js";

import {
  getSupportedRoles,
  createSkillGapAnalysis,
  getSkillGapHistory,
} from "../controllers/skillGapController.js";

const router = express.Router();

// Get available target roles
router.get(
  "/roles",
  verifyToken,
  getSupportedRoles
);

// Create new skill gap analysis
router.post(
  "/analyze",
  verifyToken,
  createSkillGapAnalysis
);

// Get previous skill gap analyses
router.get(
  "/history",
  verifyToken,
  getSkillGapHistory
);

export default router;