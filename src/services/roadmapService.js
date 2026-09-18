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
        `Roadmap Gemini attempt ${attempt}/${maxAttempts}`
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
        `Roadmap Gemini attempt ${attempt} failed:`,
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
// GENERATE PERSONALIZED ROADMAP
// ==========================================

const generateRoadmapWithGemini = async (
  role,
  missingSkills,
  learningOrder
) => {
  try {
    if (!role) {
      throw new Error(
        "Target role is required"
      );
    }

    if (
      !Array.isArray(missingSkills) ||
      !Array.isArray(learningOrder)
    ) {
      throw new Error(
        "Valid skill gap data is required"
      );
    }

    const prompt = `
You are the AI Roadmap Generator inside SkillBridge AI,
a placement preparation platform for students and fresh graduates.

Create a practical learning roadmap based ONLY on the
student's latest skill gap analysis.

TARGET ROLE:
${role}

MISSING SKILLS:
${JSON.stringify(missingSkills)}

RECOMMENDED LEARNING ORDER:
${JSON.stringify(learningOrder)}

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Do not include markdown.
3. Do not use triple backticks.
4. Focus only on the provided missing skills.
5. Do not invent additional required skills.
6. Follow the provided learning order whenever possible.
7. Keep the roadmap beginner-friendly and placement-focused.
8. Create one roadmap phase for each missing skill.
9. Duration must be realistic and short.
10. Each phase should contain 3 to 5 learning topics.
11. Each phase should contain 2 to 4 practical tasks.
12. Do not generate fake course URLs.
13. Do not claim the skills are live industry requirements.
14. Keep all explanations short and clear.

Return exactly this JSON structure:

{
  "title": "Personalized roadmap title",
  "overview": "Short roadmap overview",
  "estimatedDuration": "Example: 4 weeks",
  "phases": [
    {
      "phase": 1,
      "skill": "Skill name",
      "duration": "Example: 5 days",
      "topics": [
        "Topic 1",
        "Topic 2",
        "Topic 3"
      ],
      "tasks": [
        "Task 1",
        "Task 2"
      ],
      "outcome": "What the student should be able to do after this phase"
    }
  ]
}
`;

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
        "Gemini returned an empty roadmap"
      );
    }

    let roadmap;

    try {
      roadmap =
        JSON.parse(responseText);
    } catch {
      throw new Error(
        "Gemini returned invalid roadmap JSON"
      );
    }

    return roadmap;
  } catch (error) {
    console.error(
      "Gemini Roadmap Generation Error:",
      error.message
    );

    const status =
      error.status || error.code;

    // ======================================
    // QUOTA ERROR
    // ======================================

    if (status === 429) {
      throw new Error(
        "Gemini API quota reached. Please try again after the quota resets."
      );
    }

    // ======================================
    // TEMPORARY GEMINI SERVER ERROR
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

export default generateRoadmapWithGemini;