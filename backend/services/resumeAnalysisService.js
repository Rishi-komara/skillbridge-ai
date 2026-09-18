import generateAIResponse from "./aiProviderService.js";

// ==========================================
// RESUME ANALYSIS
// ==========================================

const analyzeResumeWithGemini = async (
  resumeText,
  resumeChecks
) => {
  try {
    // ==========================================
    // VALIDATION
    // ==========================================

    if (!resumeText) {
      throw new Error(
        "Resume text is required"
      );
    }

    // ==========================================
    // PROMPT
    // ==========================================

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
    // AI REQUEST
    //
    // PRIMARY  : Gemini
    // FALLBACK : Groq
    //
    // 429 -> immediate Groq fallback
    // 5xx -> Gemini retry -> Groq fallback
    // ==========================================

    const result =
      await generateAIResponse(prompt, {
        jsonMode: true,
        maxAttempts: 3,
      });

    const responseText = result.text;

    console.log(
      `Resume analysis completed using ${result.provider} (${result.model})`
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
    // CONVERT RESPONSE TO JSON
    // ==========================================

    let analysis;

    try {
      analysis =
        JSON.parse(responseText);
    } catch (error) {
      console.error(
        "Resume analysis JSON parse error:",
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
      "Resume Analysis Error:",
      error.message
    );

    throw error;
  }
};

export default analyzeResumeWithGemini;