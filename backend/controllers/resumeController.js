import crypto from "crypto";

import extractResumeText from "../utils/extractResumeText.js";
import runResumeChecks from "../utils/resumeChecks.js";
import analyzeResumeWithGemini from "../services/resumeAnalysisService.js";

import {
  saveResumeAnalysis,
  getResumeAnalysisHistory,
} from "../services/resumeHistoryService.js";

// ==========================================
// CREATE RESUME CONTENT HASH
// ==========================================

const createResumeHash = (resumeText) => {
  // Small normalization:
  // extra spaces/new lines valla unnecessary
  // different hash raakunda clean chestham.
  const normalizedText = resumeText
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

  return crypto
    .createHash("sha256")
    .update(normalizedText)
    .digest("hex");
};

// ==========================================
// EXTRACT RESUME TEXT
// Temporary testing endpoint
// ==========================================

export const extractResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume",
      });
    }

    console.log(
      "Resume received:",
      req.file.originalname
    );

    const resumeText =
      await extractResumeText(req.file);

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({
        success: false,
        message:
          "Unable to extract enough text from the resume",
      });
    }

    console.log(
      "Resume text extracted successfully"
    );

    return res.status(200).json({
      success: true,

      message:
        "Resume text extracted successfully",

      fileName:
        req.file.originalname,

      textLength:
        resumeText.length,

      preview:
        resumeText.substring(0, 500),
    });
  } catch (error) {
    console.error(
      "Resume extraction error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to process resume",

      error:
        error.message,
    });
  }
};

// ==========================================
// COMPLETE RESUME ANALYSIS
// ==========================================

export const analyzeResume = async (
  req,
  res
) => {
  try {
    const uid = req.uid;

    // ========================================
    // 1. VALIDATE FILE
    // ========================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume",
      });
    }

    console.log(
      "Resume analysis started:",
      req.file.originalname
    );

    // ========================================
    // 2. EXTRACT RESUME TEXT
    // ========================================

    const resumeText =
      await extractResumeText(req.file);

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({
        success: false,

        message:
          "Unable to extract enough text from the resume",
      });
    }

    console.log(
      "1. Resume text extracted"
    );

    // ========================================
    // 3. CREATE RESUME HASH
    // ========================================

    const resumeHash =
      createResumeHash(resumeText);

    console.log(
      "2. Resume hash generated:",
      resumeHash.substring(0, 12) + "..."
    );

    // ========================================
    // 4. CHECK EXISTING ANALYSIS
    // ========================================

    const existingHistory =
      await getResumeAnalysisHistory(uid);

    const cachedAnalysis =
      existingHistory.find(
        (analysis) =>
          analysis.resumeHash ===
          resumeHash
      );

    // ========================================
    // SAME RESUME → NO GEMINI CALL
    // ========================================

    if (cachedAnalysis) {
      console.log(
        "3. Existing resume analysis found"
      );

      console.log(
        "4. Gemini call skipped"
      );

      return res.status(200).json({
        success: true,

        message:
          "Existing resume analysis loaded successfully",

        cached: true,

        ...cachedAnalysis,
      });
    }

    console.log(
      "3. No cached resume analysis found"
    );

    // ========================================
    // 5. DETERMINISTIC RESUME CHECKS
    // ========================================

    const resumeChecks =
      runResumeChecks(resumeText);

    console.log(
      "4. Resume checks completed"
    );

    // ========================================
    // 6. GEMINI SEMANTIC ANALYSIS
    // ========================================

    console.log(
      "5. Calling Gemini for resume analysis"
    );

    const aiAnalysis =
      await analyzeResumeWithGemini(
        resumeText,
        resumeChecks
      );

    console.log(
      "6. Gemini analysis completed"
    );

    // ========================================
    // 7. PREPARE FINAL ANALYSIS
    // ========================================

    const finalAnalysis = {
      fileName:
        req.file.originalname,

      // Used only to detect the same resume
      resumeHash,

      atsCompatibilityScore:
        resumeChecks.baseScore,

      resumeStats: {
        wordCount:
          resumeChecks.wordCount,

        detectedSkills:
          resumeChecks.detectedSkills,

        sections:
          resumeChecks.sections,

        contact:
          resumeChecks.contact,

        actionVerbs:
          resumeChecks.detectedActionVerbs,
      },

      strengths:
        aiAnalysis.strengths || [],

      weaknesses:
        aiAnalysis.weaknesses || [],

      missingKeywords:
        aiAnalysis.missingKeywords || [],

      suggestions:
        aiAnalysis.suggestions || [],

      summary:
        aiAnalysis.summary || "",
    };

    // ========================================
    // 8. SAVE TO FIREBASE
    // ========================================

    const savedAnalysis =
      await saveResumeAnalysis(
        uid,
        finalAnalysis
      );

    console.log(
      "7. Resume analysis saved to Firebase"
    );

    // ========================================
    // 9. RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,

      message:
        "Resume analyzed successfully",

      cached: false,

      ...savedAnalysis,
    });
  } catch (error) {
    console.error(
      "Resume analysis error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to analyze resume",
    });
  }
};

// ==========================================
// GET RESUME ANALYSIS HISTORY
// ==========================================

export const getResumeHistory = async (
  req,
  res
) => {
  try {
    const history =
      await getResumeAnalysisHistory(
        req.uid
      );

    return res.status(200).json({
      success: true,

      count:
        history.length,

      history,
    });
  } catch (error) {
    console.error(
      "Resume history error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch resume analysis history",

      error:
        error.message,
    });
  }
};