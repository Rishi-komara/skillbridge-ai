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
// GET ERROR STATUS
// ==========================================

const getErrorStatus = (error) => {
  return Number(
    error?.status ||
      error?.code ||
      error?.error?.code ||
      0
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
        `Mock Interview Gemini attempt ${attempt}/${maxAttempts}`
      );

      const response =
        await ai.models.generateContent(
          request
        );

      return response;
    } catch (error) {
      lastError = error;

      const status =
        getErrorStatus(error);

      console.error(
        `Mock Interview Gemini attempt ${attempt} failed:`,
        status,
        error.message
      );

      // 429 = quota/rate limit
      // Do not retry
      if (status === 429) {
        console.log(
          "Gemini quota/rate limit reached. Retry stopped."
        );

        throw error;
      }

      // Retry only temporary server errors
      const retryableServerError =
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504;

      if (
        !retryableServerError ||
        attempt === maxAttempts
      ) {
        throw error;
      }

      const delay =
        2000 *
        Math.pow(2, attempt - 1);

      console.log(
        `Temporary Gemini error. Retrying in ${
          delay / 1000
        } seconds...`
      );

      await wait(delay);
    }
  }

  throw lastError;
};

// ==========================================
// VALID INTERVIEW TYPES
// ==========================================

const VALID_TYPES = [
  "Technical",
  "HR",
  "DSA",
];

// ==========================================
// GENERATE INTERVIEW QUESTIONS
// ==========================================

export const generateInterviewQuestions =
  async (type) => {
    try {
      // ======================================
      // VALIDATION
      // ======================================

      if (!type) {
        throw new Error(
          "Interview type is required"
        );
      }

      if (!VALID_TYPES.includes(type)) {
        throw new Error(
          "Invalid interview type"
        );
      }

      // ======================================
      // PROMPT
      // ======================================

      const prompt = `
You are the AI Mock Interview Question Generator
inside SkillBridge AI, a placement preparation
platform for students and fresh graduates.

INTERVIEW TYPE:
${type}

Generate exactly 5 interview questions.

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Do not include markdown.
3. Do not use triple backticks.
4. Generate exactly 5 questions.
5. Questions must be suitable for students and
   fresh graduates preparing for placements.
6. Keep each question clear and concise.
7. Do not include answers.
8. Do not include feedback.
9. Do not include scores.
10. Avoid duplicate questions.

QUESTION GUIDELINES:

If interview type is "Technical":
- Ask general software development and
  computer science interview questions.
- Include concepts such as Java, OOP,
  DBMS, operating systems, networking,
  APIs or software development fundamentals.
- Keep difficulty beginner to intermediate.

If interview type is "DSA":
- Focus on data structures, algorithms,
  problem-solving and complexity.
- Questions should be suitable for
  placement interviews.
- Keep difficulty beginner to intermediate.
- Questions may ask the student to explain
  an approach, not necessarily write full code.

If interview type is "HR":
- Ask behavioral and placement HR questions.
- Focus on introduction, strengths,
  weaknesses, teamwork, projects,
  challenges, career goals and situations.
- Do not ask technical coding questions.

Return exactly this JSON structure:

{
  "type": "${type}",
  "questions": [
    {
      "questionNumber": 1,
      "question": "Interview question"
    },
    {
      "questionNumber": 2,
      "question": "Interview question"
    },
    {
      "questionNumber": 3,
      "question": "Interview question"
    },
    {
      "questionNumber": 4,
      "question": "Interview question"
    },
    {
      "questionNumber": 5,
      "question": "Interview question"
    }
  ]
}
`;

      // ======================================
      // GEMINI CALL
      // ======================================

      const response =
        await generateWithRetry({
          model: "gemini-3.6-flash",

          contents: prompt,

          config: {
            responseMimeType:
              "application/json",
          },
        });

      // ======================================
      // RESPONSE TEXT
      // ======================================

      const responseText =
        response.text;

      if (!responseText) {
        throw new Error(
          "Gemini returned empty interview questions"
        );
      }

      // ======================================
      // PARSE JSON
      // ======================================

      let result;

      try {
        result =
          JSON.parse(responseText);
      } catch {
        throw new Error(
          "Gemini returned invalid interview question JSON"
        );
      }

      // ======================================
      // VALIDATE STRUCTURE
      // ======================================

      if (
        !Array.isArray(
          result.questions
        ) ||
        result.questions.length !== 5
      ) {
        throw new Error(
          "Gemini did not return exactly 5 interview questions"
        );
      }

      const validQuestions =
        result.questions.every(
          (item) =>
            typeof item.question ===
              "string" &&
            item.question.trim()
              .length > 0
        );

      if (!validQuestions) {
        throw new Error(
          "Gemini returned invalid interview questions"
        );
      }

      // ======================================
      // NORMALIZE QUESTIONS
      // ======================================

      return {
        type,

        questions:
          result.questions.map(
            (item, index) => ({
              questionNumber:
                index + 1,

              question:
                item.question.trim(),
            })
          ),
      };
    } catch (error) {
      console.error(
        "Mock Interview Question Generation Error:",
        error.message
      );

      const status =
        getErrorStatus(error);

      // ======================================
      // QUOTA ERROR
      // ======================================

      if (status === 429) {
        const quotaError =
          new Error(
            "Daily AI quota reached. Please try again after the free quota resets."
          );

        quotaError.status = 429;

        throw quotaError;
      }

      // ======================================
      // TEMPORARY GEMINI ERROR
      // ======================================

      if (
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504
      ) {
        const serviceError =
          new Error(
            "AI service is temporarily unavailable. Please try again later."
          );

        serviceError.status =
          status;

        throw serviceError;
      }

      throw error;
    }
  };

// ==========================================
// EVALUATE COMPLETE MOCK INTERVIEW
// ==========================================

export const evaluateInterviewAnswers =
  async (type, questions) => {
    try {
      // ======================================
      // VALIDATION
      // ======================================

      if (!type) {
        throw new Error(
          "Interview type is required"
        );
      }

      if (!VALID_TYPES.includes(type)) {
        throw new Error(
          "Invalid interview type"
        );
      }

      if (
        !Array.isArray(questions) ||
        questions.length === 0
      ) {
        throw new Error(
          "Interview answers are required"
        );
      }

      // ======================================
      // CHECK ALL ANSWERS
      // ======================================

      const unanswered =
        questions.some(
          (item) =>
            !item.question ||
            typeof item.answer !==
              "string" ||
            !item.answer.trim()
        );

      if (unanswered) {
        throw new Error(
          "Please answer all interview questions before evaluation"
        );
      }

      // ======================================
      // PREPARE SAFE DATA FOR GEMINI
      // ======================================

      const interviewData =
        questions.map(
          (item, index) => ({
            questionNumber:
              index + 1,

            question:
              item.question,

            answer:
              item.answer.trim(),
          })
        );

      // ======================================
      // PROMPT
      // ======================================

      const prompt = `
You are the Mock Interview Evaluator inside
SkillBridge AI, a placement preparation platform
for students and fresh graduates.

INTERVIEW TYPE:
${type}

INTERVIEW RESPONSES:
${JSON.stringify(interviewData)}

Evaluate the student's answers fairly and
constructively.

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Do not include markdown.
3. Do not use triple backticks.
4. Evaluate every provided answer.
5. Score each answer from 0 to 100.
6. Base the score only on the provided answer.
7. Do not infer voice confidence, facial expression,
   body language, emotion or personality.
8. For Technical and DSA questions, focus on
   correctness, relevance, clarity and understanding.
9. For HR questions, focus on relevance, clarity,
   structure and communication of the written answer.
10. Keep feedback short and beginner-friendly.
11. Give a specific improvement for every answer.
12. Do not insult or discourage the student.
13. Do not invent achievements or information
    that the student did not provide.
14. strengths must be based only on the submitted
    interview answers.
15. improvements must be practical and specific.
16. Return one evaluation for every question.

Return exactly this JSON structure:

{
  "overallScore": 0,

  "overallFeedback":
    "Short overall interview feedback",

  "strengths": [
    "Strength 1",
    "Strength 2"
  ],

  "improvements": [
    "Improvement 1",
    "Improvement 2"
  ],

  "evaluations": [
    {
      "questionNumber": 1,
      "score": 0,
      "feedback":
        "Short feedback for this answer",
      "improvement":
        "Specific way to improve this answer"
    }
  ]
}
`;

      // ======================================
      // GEMINI CALL
      // ======================================

      const response =
        await generateWithRetry({
          model: "gemini-3.6-flash",

          contents: prompt,

          config: {
            responseMimeType:
              "application/json",
          },
        });

      // ======================================
      // RESPONSE TEXT
      // ======================================

      const responseText =
        response.text;

      if (!responseText) {
        throw new Error(
          "Gemini returned an empty interview evaluation"
        );
      }

      // ======================================
      // PARSE JSON
      // ======================================

      let result;

      try {
        result =
          JSON.parse(responseText);
      } catch {
        throw new Error(
          "Gemini returned invalid interview evaluation JSON"
        );
      }

      // ======================================
      // VALIDATE EVALUATIONS
      // ======================================

      if (
        !Array.isArray(
          result.evaluations
        ) ||
        result.evaluations.length !==
          questions.length
      ) {
        throw new Error(
          "Gemini returned incomplete interview evaluation"
        );
      }

      // ======================================
      // NORMALIZE EACH SCORE
      // ======================================

      const evaluations =
        result.evaluations.map(
          (item, index) => {
            const rawScore =
              Number(item.score);

            const safeScore =
              Number.isFinite(rawScore)
                ? Math.min(
                    100,
                    Math.max(
                      0,
                      Math.round(
                        rawScore
                      )
                    )
                  )
                : 0;

            return {
              questionNumber:
                index + 1,

              score:
                safeScore,

              feedback:
                typeof item.feedback ===
                "string"
                  ? item.feedback
                  : "",

              improvement:
                typeof item.improvement ===
                "string"
                  ? item.improvement
                  : "",
            };
          }
        );

      // ======================================
      // CALCULATE OVERALL SCORE OURSELVES
      // ======================================

      const totalScore =
        evaluations.reduce(
          (sum, item) =>
            sum + item.score,
          0
        );

      const overallScore =
        Math.round(
          totalScore /
            evaluations.length
        );

      // ======================================
      // FINAL RESULT
      // ======================================

      return {
        overallScore,

        overallFeedback:
          typeof result.overallFeedback ===
          "string"
            ? result.overallFeedback
            : "",

        strengths:
          Array.isArray(
            result.strengths
          )
            ? result.strengths
                .filter(
                  (item) =>
                    typeof item ===
                    "string"
                )
                .slice(0, 5)
            : [],

        improvements:
          Array.isArray(
            result.improvements
          )
            ? result.improvements
                .filter(
                  (item) =>
                    typeof item ===
                    "string"
                )
                .slice(0, 5)
            : [],

        evaluations,
      };
    } catch (error) {
      console.error(
        "Mock Interview Evaluation Error:",
        error.message
      );

      const status =
        getErrorStatus(error);

      // ======================================
      // QUOTA ERROR
      // ======================================

      if (status === 429) {
        const quotaError =
          new Error(
            "Daily AI quota reached. Please try again after the free quota resets."
          );

        quotaError.status =
          429;

        throw quotaError;
      }

      // ======================================
      // TEMPORARY GEMINI ERROR
      // ======================================

      if (
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504
      ) {
        const serviceError =
          new Error(
            "AI service is temporarily unavailable. Please try again later."
          );

        serviceError.status =
          status;

        throw serviceError;
      }

      throw error;
    }
  };