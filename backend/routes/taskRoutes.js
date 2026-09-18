import express from "express";
import verifyToken from "../middleware/authMiddleware.js";

import {
  getDailyTasks,
  updateTaskStatus,
} from "../controllers/taskController.js";

const router = express.Router();

// Get tasks from user's latest roadmap
router.get("/", verifyToken, getDailyTasks);

// Mark task complete / incomplete
router.patch("/status", verifyToken, updateTaskStatus);

export default router;