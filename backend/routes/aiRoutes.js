import express from "express";
import ai from "../config/gemini.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// HELPERS
// ==========================================

const getErrorStatus = (error) => {
  return Number(
    error?.status ||
      error?.code ||
      error?.error?.code ||
      0
  );
};

// ==========================================
// GEMINI CONNECTION TEST
// ==========================================

router.get("/test", verifyToken, async (req, res) => {
  try {
    console.log("Gemini test started...");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents:
        "Reply with exactly one short sentence saying SkillBridge AI Gemini connection is working.",
    });

    const text = response.text;

    console.log("Gemini Response:", text);

    return res.status(200).json({
      success: true,
      message: "Gemini AI connected successfully",
      response: text,
    });
  } catch (error) {
    console.error("Gemini Test Error:", error);

    const status = getErrorStatus(error);

    if (status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "AI daily quota has been reached. Please try again later.",
      });
    }

    if ([500, 502, 503, 504].includes(status)) {
      return res.status(503).json({
        success: false,
        message:
          "AI service is temporarily busy. Please try again later.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Gemini AI connection failed.",
    });
  }
});

// ==========================================
// AI CAREER ASSISTANT
// ==========================================

router.post("/chat", verifyToken, async (req, res) => {
  try {
    const userPrompt = req.body?.userPrompt?.trim();

    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (!userPrompt) {
      return res.status(400).json({
        success: false,
        message: "Please enter a message.",
      });
    }

    if (userPrompt.length > 2000) {
      return res.status(400).json({
        success: false,
        message:
          "Message is too long. Please keep it under 2000 characters.",
      });
    }

    console.log("AI career assistant request started...");

    // ----------------------------------------
    // GEMINI REQUEST
    // ----------------------------------------

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",

      contents: `
You are SkillBridge AI, a career preparation assistant for students and fresh graduates.

Your purpose is to help with:
- placement preparation
- resumes and ATS improvement
- programming and DSA learning
- technical interview preparation
- HR interview preparation
- career and skill development
- study roadmaps
- software development learning

Instructions:
- Give clear, practical, beginner-friendly answers.
- Prefer simple English.
- Use short structured explanations when useful.
- Do not invent the user's resume score, skill-gap score, roadmap progress, interview score, achievements, experience, or personal information.
- If information about the user is not provided in this conversation, do not pretend to know it.
- Do not claim that the user is guaranteed to get a job or clear an interview.
- For important factual claims, encourage verification when appropriate.
- Stay focused on career preparation and learning.

Student message:
${userPrompt}
      `.trim(),
    });

    const text = response.text?.trim();

    if (!text) {
      return res.status(502).json({
        success: false,
        message:
          "AI did not return a response. Please try again.",
      });
    }

    console.log("AI career assistant response generated.");

    // ----------------------------------------
    // RESPONSE
    // ----------------------------------------

    return res.status(200).json({
      success: true,
      response: text,
    });
  } catch (error) {
    console.error("AI Chat Error:", error);

    const status = getErrorStatus(error);

    // ----------------------------------------
    // FREE-TIER QUOTA
    // ----------------------------------------

    if (status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "AI daily quota has been reached. Please try again later.",
      });
    }

    // ----------------------------------------
    // TEMPORARY GEMINI ERROR
    // ----------------------------------------

    if ([500, 502, 503, 504].includes(status)) {
      return res.status(503).json({
        success: false,
        message:
          "AI service is temporarily busy. Please try again later.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "AI assistant could not respond. Please try again.",
    });
  }
});

export default router;