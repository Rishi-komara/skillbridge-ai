import { db } from "../config/firebase.js";

// ==========================================
// SAVE RESUME ANALYSIS
// ==========================================

export const saveResumeAnalysis = async (
  uid,
  analysisData
) => {
  try {
    if (!uid) {
      throw new Error("User ID is required");
    }

    if (!analysisData) {
      throw new Error("Analysis data is required");
    }

    // Create a new unique analysis ID
    const analysisRef = db
      .ref(`users/${uid}/resumeAnalyses`)
      .push();

    const analysisId = analysisRef.key;

    const dataToSave = {
      analysisId,

      fileName:
        analysisData.fileName || "Resume",
        resumeHash: analysisData.resumeHash || "",

      atsCompatibilityScore:
        analysisData.atsCompatibilityScore || 0,

      resumeStats:
        analysisData.resumeStats || {},

      strengths:
        analysisData.strengths || [],

      weaknesses:
        analysisData.weaknesses || [],

      missingKeywords:
        analysisData.missingKeywords || [],

      suggestions:
        analysisData.suggestions || [],

      summary:
        analysisData.summary || "",

      analyzedAt:
        new Date().toISOString(),
    };

    await analysisRef.set(dataToSave);

    console.log(
      "Resume analysis saved:",
      analysisId
    );

    return dataToSave;
  } catch (error) {
    console.error(
      "Save Resume Analysis Error:",
      error
    );

    throw error;
  }
};

// ==========================================
// GET USER RESUME ANALYSIS HISTORY
// ==========================================

export const getResumeAnalysisHistory =
  async (uid) => {
    try {
      if (!uid) {
        throw new Error(
          "User ID is required"
        );
      }

      const snapshot = await db
        .ref(
          `users/${uid}/resumeAnalyses`
        )
        .once("value");

      if (!snapshot.exists()) {
        return [];
      }

      const data = snapshot.val();

      const history = Object.values(data);

      // Latest analysis first
      history.sort(
        (a, b) =>
          new Date(b.analyzedAt) -
          new Date(a.analyzedAt)
      );

      return history;
    } catch (error) {
      console.error(
        "Get Resume History Error:",
        error
      );

      throw error;
    }
  };