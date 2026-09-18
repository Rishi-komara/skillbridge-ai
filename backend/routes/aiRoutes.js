import express from "express";
import generateAIResponse from "../services/aiProviderService.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// AI CONNECTION TEST
// ==========================================

router.get(
  "/test",
  verifyToken,
  async (req, res) => {
    try {
      console.log(
        "AI provider connection test started..."
      );

      const result =
        await generateAIResponse(
          "Reply with exactly one short sentence saying SkillBridge AI connection is working.",
          {
            jsonMode: false,
            maxAttempts: 3,
          }
        );

      const text =
        result.text?.trim();

      if (!text) {
        return res.status(502).json({
          success: false,
          message:
            "AI provider did not return a response.",
        });
      }

      console.log(
        `AI test completed using ${result.provider} (${result.model})`
      );

      return res.status(200).json({
        success: true,
        message:
          "AI connected successfully",
        response: text,
        provider: result.provider,
      });
    } catch (error) {
      console.error(
        "AI Connection Test Error:",
        error.message
      );

      return res.status(503).json({
        success: false,
        message:
          "AI services are temporarily unavailable. Please try again later.",
      });
    }
  }
);

// ==========================================
// AI CAREER ASSISTANT
// ==========================================

router.post(
  "/chat",
  verifyToken,
  async (req, res) => {
    try {
      const userPrompt =
        req.body?.userPrompt?.trim();

      // ======================================
      // VALIDATION
      // ======================================

      if (!userPrompt) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a message.",
        });
      }

      if (userPrompt.length > 2000) {
        return res.status(400).json({
          success: false,
          message:
            "Message is too long. Please keep it under 2000 characters.",
        });
      }

      console.log(
        "AI career assistant request started..."
      );

      // ======================================
      // PROMPT
      // ======================================

      const prompt = `
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
      `.trim();

      // ======================================
      // AI REQUEST
      //
      // PRIMARY  : GEMINI
      // FALLBACK : GROQ
      // ======================================

      const result =
        await generateAIResponse(
          prompt,
          {
            jsonMode: false,
            maxAttempts: 3,
          }
        );

      // ======================================
      // RESPONSE
      // ======================================

      const text =
        result.text?.trim();

      if (!text) {
        return res.status(502).json({
          success: false,
          message:
            "AI did not return a response. Please try again.",
        });
      }

      console.log(
        `AI career assistant response generated using ${result.provider} (${result.model})`
      );

      return res.status(200).json({
        success: true,
        response: text,
      });
    } catch (error) {
      console.error(
        "AI Chat Error:",
        error.message
      );

      return res.status(503).json({
        success: false,
        message:
          "AI assistant could not respond right now. Please try again later.",
      });
    }
  }
);

export default router;