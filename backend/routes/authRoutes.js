import express from "express";

import verifyToken from "../middleware/authMiddleware.js";
import {
  createUserProfile,
  getUserProfile,
} from "../controllers/authController.js";

const router = express.Router();

// Create profile after Firebase signup
router.post("/profile", verifyToken, createUserProfile);

// Get logged-in user's profile
router.get("/profile", verifyToken, getUserProfile);

export default router;