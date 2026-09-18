import { db } from "../config/firebase.js";
import generateRoadmapWithGemini from "../services/roadmapService.js";

// ==========================================
// GENERATE / REUSE ROADMAP
// ==========================================

export const generateRoadmap = async (req, res) => {
  try {
    const uid = req.uid;

    console.log("1. Roadmap request started");

    // ========================================
    // 1. GET LATEST SKILL GAP
    // ========================================

    const skillGapSnapshot = await db
      .ref(`users/${uid}/skillGapAnalyses`)
      .once("value");

    if (!skillGapSnapshot.exists()) {
      return res.status(400).json({
        success: false,
        message:
          "Please complete Skill Gap Analysis first",
      });
    }

    const skillGapHistory = Object.values(
      skillGapSnapshot.val()
    );

    skillGapHistory.sort(
      (a, b) =>
        new Date(b.analyzedAt) -
        new Date(a.analyzedAt)
    );

    const latestSkillGap =
      skillGapHistory[0];

    const skillGapAnalysisId =
      latestSkillGap.analysisId || "";

    const role =
      latestSkillGap.role;

    const missingSkills =
      latestSkillGap.missingSkills || [];

    let learningOrder =
      latestSkillGap.learningOrder || [];

    console.log(
      "2. Latest skill gap:",
      role
    );

    console.log(
      "Skill Gap Analysis ID:",
      skillGapAnalysisId
    );

    // ========================================
    // 2. VALIDATE MISSING SKILLS
    // ========================================

    if (missingSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No missing skills found for your latest target role",
      });
    }

    if (learningOrder.length === 0) {
      learningOrder =
        missingSkills.map(
          (skill) => skill.name
        );
    }

    // ========================================
    // 3. CHECK EXISTING ROADMAP
    // ========================================

    const roadmapSnapshot = await db
      .ref(`users/${uid}/roadmaps`)
      .once("value");

    if (roadmapSnapshot.exists()) {
      const existingRoadmaps =
        Object.values(
          roadmapSnapshot.val()
        );

      const matchingRoadmap =
        existingRoadmaps.find(
          (item) =>
            item.sourceSkillGapAnalysisId ===
              skillGapAnalysisId &&
            item.role === role
        );

      // ======================================
      // SAME SKILL GAP = REUSE ROADMAP
      // NO GEMINI CALL
      // ======================================

      if (matchingRoadmap) {
        console.log(
          "3. Existing roadmap found"
        );

        console.log(
          "4. Gemini call skipped"
        );

        return res.status(200).json({
          success: true,
          message:
            "Existing roadmap loaded successfully",
          cached: true,
          ...matchingRoadmap,
        });
      }
    }

    // ========================================
    // 4. NO ROADMAP → CALL GEMINI
    // ========================================

    console.log(
      "3. No roadmap found for this skill gap"
    );

    console.log(
      "4. Generating new AI roadmap"
    );

    const aiRoadmap =
      await generateRoadmapWithGemini(
        role,
        missingSkills,
        learningOrder
      );

    console.log(
      "5. Gemini roadmap generated"
    );

    // ========================================
    // 5. PREPARE ROADMAP
    // ========================================

    const finalRoadmap = {
      role,

      sourceSkillGapAnalysisId:
        skillGapAnalysisId,

      title:
        aiRoadmap.title ||
        `${role} Learning Roadmap`,

      overview:
        aiRoadmap.overview || "",

      estimatedDuration:
        aiRoadmap.estimatedDuration || "",

      phases:
        aiRoadmap.phases || [],

      totalPhases:
        aiRoadmap.phases?.length || 0,

      progressPercentage: 0,

      createdAt:
        new Date().toISOString(),
    };

    // ========================================
    // 6. SAVE ROADMAP
    // ========================================

    const roadmapRef = db
      .ref(`users/${uid}/roadmaps`)
      .push();

    finalRoadmap.roadmapId =
      roadmapRef.key;

    await roadmapRef.set(
      finalRoadmap
    );

    console.log(
      "6. Roadmap saved:",
      finalRoadmap.roadmapId
    );

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,

      message:
        "Personalized roadmap generated successfully",

      cached: false,

      ...finalRoadmap,
    });
  } catch (error) {
    console.error(
      "Generate Roadmap Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to generate roadmap",
    });
  }
};

// ==========================================
// GET ROADMAP HISTORY
// ==========================================

export const getRoadmapHistory = async (
  req,
  res
) => {
  try {
    const uid = req.uid;

    const snapshot = await db
      .ref(`users/${uid}/roadmaps`)
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
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    return res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    console.error(
      "Get Roadmap History Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch roadmap history",
      error: error.message,
    });
  }
};