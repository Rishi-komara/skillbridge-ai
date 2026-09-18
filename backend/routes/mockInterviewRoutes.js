import express from "express";

import verifyToken from "../middleware/authMiddleware.js";

import {
  startMockInterview,
  evaluateMockInterview,
  getMockInterviewHistory,
  saveMockInterviewAnswer,
} from "../controllers/mockInterviewController.js";

const router = express.Router();

// ==========================================
// START NEW MOCK INTERVIEW
// ==========================================

router.post(
  "/start",
  verifyToken,
  startMockInterview
);

// ==========================================
// SAVE / UPDATE ONE ANSWER
// ==========================================

router.patch(
  "/:interviewId/answer",
  verifyToken,
  saveMockInterviewAnswer
);

// ==========================================
// EVALUATE COMPLETE INTERVIEW
// ==========================================

router.post(
  "/evaluate",
  verifyToken,
  evaluateMockInterview
);

// ==========================================
// GET INTERVIEW HISTORY
// ==========================================

router.get(
  "/history",
  verifyToken,
  getMockInterviewHistory
);

export default router;