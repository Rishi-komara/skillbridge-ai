import { db } from "../config/firebase.js";
import roleSkills from "../data/roleSkills.js";
import analyzeSkillGap from "../services/skillGapService.js";
import analyzeSkillGapWithGemini from "../services/skillGapAIService.js";

// ==========================================
// GET SUPPORTED ROLES
// ==========================================

export const getSupportedRoles = async (
  req,
  res
) => {
  try {
    const roles = Object.keys(roleSkills);

    return res.status(200).json({
      success: true,
      roles,
    });
  } catch (error) {
    console.error(
      "Get Supported Roles Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch supported roles",
    });
  }
};

// ==========================================
// ANALYZE / REUSE SKILL GAP
// ==========================================

export const createSkillGapAnalysis = async (
  req,
  res
) => {
  try {
    const uid = req.uid;
    const { role } = req.body;

    // ========================================
    // 1. VALIDATE ROLE
    // ========================================

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Target role is required",
      });
    }

    if (!roleSkills[role]) {
      return res.status(400).json({
        success: false,
        message:
          "Selected role is not supported",
      });
    }

    console.log(
      "1. Skill gap request started:",
      role
    );

    // ========================================
    // 2. GET LATEST RESUME ANALYSIS
    // ========================================

    const resumeSnapshot = await db
      .ref(`users/${uid}/resumeAnalyses`)
      .once("value");

    if (!resumeSnapshot.exists()) {
      return res.status(400).json({
        success: false,
        message:
          "Please analyze your resume first",
      });
    }

    const resumeAnalyses =
      Object.values(
        resumeSnapshot.val()
      );

    resumeAnalyses.sort(
      (a, b) =>
        new Date(b.analyzedAt) -
        new Date(a.analyzedAt)
    );

    const latestResume =
      resumeAnalyses[0];

    const resumeAnalysisId =
      latestResume.analysisId || "";

    console.log(
      "2. Latest resume analysis:",
      resumeAnalysisId
    );

    // ========================================
    // 3. CHECK EXISTING SKILL GAP
    // ========================================

    const skillGapSnapshot = await db
      .ref(`users/${uid}/skillGapAnalyses`)
      .once("value");

    if (skillGapSnapshot.exists()) {
      const existingAnalyses =
        Object.values(
          skillGapSnapshot.val()
        );

      const matchingAnalysis =
        existingAnalyses.find(
          (analysis) =>
            analysis.sourceResumeAnalysisId ===
              resumeAnalysisId &&
            analysis.role === role
        );

      // ======================================
      // SAME RESUME + SAME ROLE
      // RETURN EXISTING RESULT
      // ======================================

      if (matchingAnalysis) {
        console.log(
          "3. Existing Skill Gap found"
        );

        console.log(
          "4. Gemini call skipped"
        );

        return res.status(200).json({
          success: true,

          message:
            "Existing skill gap loaded successfully",

          cached: true,

          ...matchingAnalysis,
        });
      }
    }

    // ========================================
    // 4. GET DETECTED RESUME SKILLS
    // ========================================

    const resumeSkills =
      latestResume.resumeStats
        ?.detectedSkills || [];

    console.log(
      "3. No cached Skill Gap found"
    );

    console.log(
      "4. Resume skills loaded:",
      resumeSkills
    );

    // ========================================
    // 5. DETERMINISTIC SKILL COMPARISON
    // ========================================

    const gapResult =
      analyzeSkillGap(
        role,
        resumeSkills
      );

    console.log(
      "5. Skill comparison completed"
    );

    // ========================================
    // 6. GEMINI PRIORITY ANALYSIS
    // ========================================

    let aiAnalysis = {
      prioritizedMissingSkills: [],
      learningOrder: [],
      summary: "",
    };

    if (
      gapResult.missingSkills.length > 0
    ) {
      console.log(
        "6. Calling Gemini for skill priority"
      );

      aiAnalysis =
        await analyzeSkillGapWithGemini(
          role,
          gapResult.matchedSkills,
          gapResult.missingSkills
        );

      console.log(
        "7. Gemini skill analysis completed"
      );
    } else {
      console.log(
        "6. No missing skills - Gemini skipped"
      );

      aiAnalysis.summary =
        "All curated skills for this role were detected in the latest resume analysis.";
    }

    // ========================================
    // 7. SAFE AI RESULT FALLBACK
    // ========================================

    const finalMissingSkills =
      Array.isArray(
        aiAnalysis.prioritizedMissingSkills
      ) &&
      aiAnalysis.prioritizedMissingSkills
        .length > 0
        ? aiAnalysis.prioritizedMissingSkills
        : gapResult.missingSkills;

    const finalLearningOrder =
      Array.isArray(
        aiAnalysis.learningOrder
      ) &&
      aiAnalysis.learningOrder.length > 0
        ? aiAnalysis.learningOrder
        : gapResult.missingSkills.map(
            (skill) => skill.name
          );

    // ========================================
    // 8. PREPARE FINAL RESULT
    // ========================================

    const finalAnalysis = {
      role,

      sourceResumeAnalysisId:
        resumeAnalysisId,

      totalRequiredSkills:
        gapResult.totalRequiredSkills,

      matchedCount:
        gapResult.matchedCount,

      missingCount:
        gapResult.missingCount,

      skillCompletionPercentage:
        gapResult.skillCompletionPercentage,

      skillGapPercentage:
        gapResult.skillGapPercentage,

      matchedSkills:
        gapResult.matchedSkills,

      missingSkills:
        finalMissingSkills,

      learningOrder:
        finalLearningOrder,

      summary:
        aiAnalysis.summary || "",

      analyzedAt:
        new Date().toISOString(),
    };

    // ========================================
    // 9. SAVE TO FIREBASE
    // ========================================

    const analysisRef = db
      .ref(`users/${uid}/skillGapAnalyses`)
      .push();

    finalAnalysis.analysisId =
      analysisRef.key;

    await analysisRef.set(
      finalAnalysis
    );

    console.log(
      "8. Skill gap saved:",
      finalAnalysis.analysisId
    );

    // ========================================
    // 10. SEND RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,

      message:
        "Skill gap analyzed successfully",

      cached: false,

      ...finalAnalysis,
    });
  } catch (error) {
    console.error(
      "Skill Gap Analysis Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to analyze skill gap",
    });
  }
};

// ==========================================
// GET SKILL GAP HISTORY
// ==========================================

export const getSkillGapHistory = async (
  req,
  res
) => {
  try {
    const uid = req.uid;

    const snapshot = await db
      .ref(`users/${uid}/skillGapAnalyses`)
      .once("value");

    if (!snapshot.exists()) {
      return res.status(200).json({
        success: true,
        count: 0,
        history: [],
      });
    }

    const history =
      Object.values(snapshot.val());

    history.sort(
      (a, b) =>
        new Date(b.analyzedAt) -
        new Date(a.analyzedAt)
    );

    return res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    console.error(
      "Get Skill Gap History Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch skill gap history",

      error:
        error.message,
    });
  }
};