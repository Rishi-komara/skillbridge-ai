import generateAIResponse from "./aiProviderService.js";

// ==========================================
// SKILL GAP AI ANALYSIS
// ==========================================

const analyzeSkillGapWithGemini = async (
  role,
  matchedSkills,
  missingSkills
) => {
  try {
    // ==========================================
    // VALIDATION
    // ==========================================

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

    // ==========================================
    // PROMPT
    // ==========================================

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
    // AI REQUEST
    //
    // PRIMARY  : GEMINI
    // FALLBACK : GROQ
    //
    // Gemini 429 -> immediate Groq
    // Gemini 5xx -> retry -> Groq
    // ==========================================

    const result =
      await generateAIResponse(prompt, {
        jsonMode: true,
        maxAttempts: 3,
      });

    const responseText = result.text;

    console.log(
      `Skill Gap analysis completed using ${result.provider} (${result.model})`
    );

    // ==========================================
    // CHECK EMPTY RESPONSE
    // ==========================================

    if (!responseText) {
      throw new Error(
        "AI provider returned an empty response"
      );
    }

    // ==========================================
    // PARSE JSON
    // ==========================================

    let analysis;

    try {
      analysis =
        JSON.parse(responseText);
    } catch (error) {
      console.error(
        "Skill Gap JSON parse error:",
        error.message
      );

      throw new Error(
        "AI provider returned invalid JSON"
      );
    }

    // ==========================================
    // RETURN SAME STRUCTURE AS BEFORE
    // ==========================================

    return analysis;
  } catch (error) {
    console.error(
      "Skill Gap AI Analysis Error:",
      error.message
    );

    throw error;
  }
};

export default analyzeSkillGapWithGemini;