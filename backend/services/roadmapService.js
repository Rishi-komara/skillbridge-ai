import generateAIResponse from "./aiProviderService.js";

// ==========================================
// GENERATE PERSONALIZED ROADMAP
// ==========================================

const generateRoadmapWithGemini = async (
  role,
  missingSkills,
  learningOrder
) => {
  try {
    // ========================================
    // VALIDATION
    // ========================================

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

    // ========================================
    // PROMPT
    // ========================================

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

      "outcome":
        "What the student should be able to do after this phase"
    }
  ]
}
`;

    // ========================================
    // AI REQUEST
    //
    // PRIMARY  : GEMINI
    // FALLBACK : GROQ
    //
    // Gemini 429 -> immediate Groq
    // Gemini 5xx -> retry -> Groq
    // ========================================

    const result =
      await generateAIResponse(prompt, {
        jsonMode: true,
        maxAttempts: 3,
      });

    // ========================================
    // RESPONSE TEXT
    // ========================================

    const responseText = result.text;

    console.log(
      `Roadmap generated using ${result.provider} (${result.model})`
    );

    if (!responseText) {
      throw new Error(
        "AI provider returned an empty roadmap"
      );
    }

    // ========================================
    // JSON PARSING
    // ========================================

    let roadmap;

    try {
      roadmap = JSON.parse(responseText);
    } catch (error) {
      console.error(
        "Roadmap JSON parse error:",
        error.message
      );

      throw new Error(
        "AI provider returned invalid roadmap JSON"
      );
    }

    // ========================================
    // RETURN ROADMAP
    // ========================================

    return roadmap;
  } catch (error) {
    console.error(
      "AI Roadmap Generation Error:",
      error.message
    );

    throw error;
  }
};

export default generateRoadmapWithGemini;