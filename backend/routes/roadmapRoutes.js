import express from "express";
import verifyToken from "../middleware/authMiddleware.js";

import {
  generateRoadmap,
  getRoadmapHistory,
} from "../controllers/roadmapController.js";

const router = express.Router();

// Generate personalized roadmap
router.post(
  "/generate",
  verifyToken,
  generateRoadmap
);

// Get previous roadmaps
router.get(
  "/history",
  verifyToken,
  getRoadmapHistory
);

export default router;