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
        `Gemini request attempt ${attempt}/${maxAttempts}`
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
        `Gemini attempt ${attempt} failed:`,
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
      // RETRY ONLY TEMPORARY SERVER ERRORS
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

      // Attempt 1 fail -> wait 2 sec
      // Attempt 2 fail -> wait 4 sec
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
// RESUME ANALYSIS
// ==========================================

const analyzeResumeWithGemini = async (
  resumeText,
  resumeChecks
) => {
  try {
    if (!resumeText) {
      throw new Error(
        "Resume text is required"
      );
    }

    const prompt = `
You are a resume analysis assistant for SkillBridge AI,
a placement preparation platform for students and fresh graduates.

Analyze the resume given below.

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Do not include markdown.
3. Do not include triple backticks.
4. Do not invent experience, projects, skills, or achievements.
5. Base your analysis only on the provided resume.
6. Keep feedback simple, practical, and suitable for a student.
7. "missingKeywords" should contain useful technical or professional
   keywords that could strengthen the resume based on its existing profile.
8. Do not include private contact information in your response.

The backend has already performed objective resume checks.

OBJECTIVE CHECKS:
${JSON.stringify(resumeChecks)}

RESUME:
${resumeText}

Return exactly this JSON structure:

{
  "strengths": [
    "strength 1",
    "strength 2",
    "strength 3"
  ],
  "weaknesses": [
    "weakness 1",
    "weakness 2",
    "weakness 3"
  ],
  "missingKeywords": [
    "keyword 1",
    "keyword 2",
    "keyword 3"
  ],
  "suggestions": [
    "suggestion 1",
    "suggestion 2",
    "suggestion 3"
  ],
  "summary": "Short overall resume analysis"
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

    // ==========================================
    // CHECK EMPTY RESPONSE
    // ==========================================

    if (!responseText) {
      throw new Error(
        "Gemini returned an empty response"
      );
    }

    // ==========================================
    // CONVERT RESPONSE TO JSON
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
      "Gemini Resume Analysis Error:",
      error.message
    );

    const status =
      error.status || error.code;

    // ======================================
    // 429 - QUOTA EXCEEDED
    // ======================================

    if (status === 429) {
      throw new Error(
        "Gemini API quota reached. Please try again after the quota resets."
      );
    }

    // ======================================
    // TEMPORARY GEMINI SERVER PROBLEM
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

    // Other errors
    throw error;
  }
};

export default analyzeResumeWithGemini;