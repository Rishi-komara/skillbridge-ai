import ai from "../config/gemini.js";

// ==========================================
// WAIT HELPER
// ==========================================

const wait = (ms) => {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
};

// ==========================================
// GEMINI REQUEST WITH RETRY
// ==========================================

const generateWithRetry = async (
  request,
  maxAttempts = 3
) => {
  let lastError;

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt++
  ) {
    try {
      console.log(
        `Skill Gap Gemini attempt ${attempt}/${maxAttempts}`
      );

      const response =
        await ai.models.generateContent(
          request
        );

      return response;
    } catch (error) {
      lastError = error;

      const status =
        error.status || error.code;

      console.error(
        `Skill Gap Gemini attempt ${attempt} failed:`,
        status,
        error.message
      );

      // ======================================
      // 429 = QUOTA / RATE LIMIT
      // DO NOT RETRY
      // ======================================

      if (status === 429) {
        throw error;
      }

      // ======================================
      // RETRY TEMPORARY SERVER ERRORS ONLY
      // ======================================

      const retryable =
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504;

      if (
        !retryable ||
        attempt === maxAttempts
      ) {
        throw error;
      }

      // 2 sec -> 4 sec
      const delay =
        2000 *
        Math.pow(2, attempt - 1);

      console.log(
        `Gemini temporarily unavailable. Retrying in ${
          delay / 1000
        } seconds...`
      );

      await wait(delay);
    }
  }

  throw lastError;
};

// ==========================================
// SKILL GAP AI ANALYSIS
// ==========================================

const analyzeSkillGapWithGemini = async (
  role,
  matchedSkills,
  missingSkills
) => {
  try {
    if (!role) {
      throw new Error(
        "Target role is required"
      );
    }

    if (
      !Array.isArray(matchedSkills) ||
      !Array.isArray(missingSkills)
    ) {
      throw new Error(
        "Valid skill data is required"
      );
    }

    const prompt = `
You are the Skill Gap Analysis assistant
inside SkillBridge AI, a placement preparation
platform for students and fresh graduates.

TARGET ROLE:
${role}

MATCHED SKILLS:
${JSON.stringify(matchedSkills)}

MISSING SKILLS:
${JSON.stringify(missingSkills)}

Analyze ONLY the missing skills provided above.

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Do not return markdown.
3. Do not use triple backticks.
4. Do not invent additional missing skills.
5. Use only the missing skills provided.
6. Priority must be exactly:
   "High", "Medium", or "Low".
7. Give short and beginner-friendly reasons.
8. learningOrder must contain only the names
   of the provided missing skills.
9. Do not claim these are live industry
   requirements.

Return exactly this JSON structure:

{
  "prioritizedMissingSkills": [
    {
      "name": "Skill name",
      "category": "Skill category",
      "priority": "High",
      "reason": "Short reason why this skill is important"
    }
  ],
  "learningOrder": [
    "Skill 1",
    "Skill 2"
  ],
  "summary": "Short overall skill gap summary"
}
`;

    // ==========================================
    // CALL GEMINI
    // ==========================================

    const response =
      await generateWithRetry({
        model: "gemini-3.6-flash",

        contents: prompt,

        config: {
          responseMimeType:
            "application/json",
        },
      });

    const responseText =
      response.text;

    if (!responseText) {
      throw new Error(
        "Gemini returned an empty response"
      );
    }

    // ==========================================
    // PARSE JSON
    // ==========================================

    let analysis;

    try {
      analysis =
        JSON.parse(responseText);
    } catch {
      throw new Error(
        "Gemini returned invalid JSON"
      );
    }

    return analysis;
  } catch (error) {
    console.error(
      "Gemini Skill Gap Analysis Error:",
      error.message
    );

    const status =
      error.status || error.code;

    // ======================================
    // 429 = QUOTA EXCEEDED
    // ======================================

    if (status === 429) {
      throw new Error(
        "Gemini API quota reached. Please try again after the quota resets."
      );
    }

    // ======================================
    // TEMPORARY SERVER ERROR
    // ======================================

    if (
      status === 500 ||
      status === 502 ||
      status === 503 ||
      status === 504
    ) {
      throw new Error(
        "AI service is temporarily unavailable. Please try again in a moment."
      );
    }

    throw error;
  }
};

export default analyzeSkillGapWithGemini;