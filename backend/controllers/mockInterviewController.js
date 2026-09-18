import { db } from "../config/firebase.js";

import {
  generateInterviewQuestions,
  evaluateInterviewAnswers,
} from "../services/mockInterviewService.js";

// ==========================================
// VALID INTERVIEW TYPES
// ==========================================

const VALID_TYPES = [
  "Technical",
  "HR",
  "DSA",
];

// ==========================================
// HELPER - NORMALIZE QUESTIONS
// ==========================================

const normalizeQuestions = (questions) => {
  if (Array.isArray(questions)) {
    return questions;
  }

  if (
    questions &&
    typeof questions === "object"
  ) {
    return Object.values(questions).sort(
      (a, b) =>
        Number(a?.questionNumber || 0) -
        Number(b?.questionNumber || 0)
    );
  }

  return [];
};

// ==========================================
// HELPER - GET ERROR STATUS
// ==========================================

const getErrorStatus = (error) => {
  const status = Number(
    error?.status ||
      error?.response?.status ||
      500
  );

  return Number.isFinite(status)
    ? status
    : 500;
};

// ==========================================
// START MOCK INTERVIEW
// ==========================================

export const startMockInterview = async (
  req,
  res
) => {
  try {
    const uid = req.uid;
    const { type } = req.body;

    console.log(
      "1. Mock interview start request:",
      type
    );

    // ========================================
    // 1. VALIDATION
    // ========================================

    if (!type) {
      return res.status(400).json({
        success: false,
        message:
          "Interview type is required",
      });
    }

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid interview type",
      });
    }

    // ========================================
    // 2. GENERATE QUESTIONS
    // ========================================

    console.log(
      "2. Generating interview questions"
    );

    const generated =
      await generateInterviewQuestions(
        type
      );

    console.log(
      "3. Interview questions generated"
    );

    // ========================================
    // 3. VALIDATE GENERATED QUESTIONS
    // ========================================

    if (
      !generated ||
      !Array.isArray(
        generated.questions
      ) ||
      generated.questions.length === 0
    ) {
      return res.status(500).json({
        success: false,
        message:
          "AI did not return interview questions",
      });
    }

    // ========================================
    // 4. CREATE FIREBASE SESSION
    // ========================================

    const interviewRef = db
      .ref(
        `users/${uid}/mockInterviews`
      )
      .push();

    const interviewId =
      interviewRef.key;

    const createdAt =
      new Date().toISOString();

    // ========================================
    // 5. PREPARE QUESTIONS
    // ========================================

    const questions =
      generated.questions.map(
        (item, index) => ({
          questionNumber:
            index + 1,

          question:
            item.question,

          answer: "",

          answered: false,

          feedback: null,
        })
      );

    // ========================================
    // 6. PREPARE SESSION
    // ========================================

    const interview = {
      interviewId,

      type,

      status: "in-progress",

      currentQuestion: 1,

      totalQuestions:
        questions.length,

      answeredQuestions: 0,

      questions,

      overallScore: null,

      overallFeedback: "",

      strengths: [],

      improvements: [],

      createdAt,

      completedAt: null,
    };

    // ========================================
    // 7. SAVE SESSION
    // ========================================

    await interviewRef.set(
      interview
    );

    console.log(
      "4. Mock interview saved:",
      interviewId
    );

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(201).json({
      success: true,

      message:
        "Mock interview started successfully",

      ...interview,
    });
  } catch (error) {
    console.error(
      "Start Mock Interview Error:",
      error
    );

    const status =
      getErrorStatus(error);

    // Daily quota / rate limit
    if (status === 429) {
      return res.status(429).json({
        success: false,

        message:
          error?.message ||
          "Daily AI quota reached. Please try again later.",
      });
    }

    // Gemini temporarily unavailable
    if (
      status === 502 ||
      status === 503 ||
      status === 504
    ) {
      return res.status(status).json({
        success: false,

        message:
          "AI service is temporarily busy. Please try starting the interview again later.",
      });
    }

    return res.status(500).json({
      success: false,

      message:
        error?.message ||
        "Failed to start mock interview",
    });
  }
};

// ==========================================
// SAVE / UPDATE MOCK INTERVIEW ANSWER
// ==========================================

export const saveMockInterviewAnswer =
  async (req, res) => {
    try {
      const uid = req.uid;

      const { interviewId } =
        req.params;

      const {
        questionIndex,
        answer,
      } = req.body;

      console.log(
        "Saving mock interview answer:",
        interviewId,
        questionIndex
      );

      // ======================================
      // 1. VALIDATION
      // ======================================

      if (!interviewId) {
        return res.status(400).json({
          success: false,

          message:
            "Interview ID is required",
        });
      }

      if (
        !Number.isInteger(
          questionIndex
        ) ||
        questionIndex < 0
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Valid question index is required",
        });
      }

      if (
        typeof answer !== "string" ||
        !answer.trim()
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Answer cannot be empty",
        });
      }

      const cleanAnswer =
        answer.trim();

      if (
        cleanAnswer.length > 5000
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Answer cannot exceed 5000 characters",
        });
      }

      // ======================================
      // 2. GET INTERVIEW
      // ======================================

      const interviewRef =
        db.ref(
          `users/${uid}/mockInterviews/${interviewId}`
        );

      const snapshot =
        await interviewRef.once(
          "value"
        );

      if (!snapshot.exists()) {
        return res.status(404).json({
          success: false,

          message:
            "Mock interview not found",
        });
      }

      const interview =
        snapshot.val();

      // ======================================
      // 3. DON'T EDIT COMPLETED INTERVIEW
      // ======================================

      if (
        interview.status ===
        "completed"
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Completed interview cannot be edited",
        });
      }

      // ======================================
      // 4. NORMALIZE QUESTIONS
      // ======================================

      const questions =
        normalizeQuestions(
          interview.questions
        );

      if (
        questions.length === 0
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Interview questions are missing",
        });
      }

      if (
        questionIndex >=
        questions.length
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Interview question not found",
        });
      }

      // ======================================
      // 5. UPDATE ANSWER
      // ======================================

      questions[questionIndex] = {
        ...questions[
          questionIndex
        ],

        answer: cleanAnswer,

        answered: true,
      };

      // ======================================
      // 6. CALCULATE ANSWERED COUNT
      // ======================================

      const answeredQuestions =
        questions.filter(
          (item) =>
            typeof item?.answer ===
              "string" &&
            item.answer.trim()
        ).length;

      // ======================================
      // 7. SAVE TO FIREBASE
      // ======================================

      await interviewRef.update({
        questions,

        answeredQuestions,

        currentQuestion:
          questionIndex + 1,
      });

      console.log(
        `Answer saved successfully: ${interviewId} - Question ${
          questionIndex + 1
        }`
      );

      // ======================================
      // RESPONSE
      // ======================================

      return res.status(200).json({
        success: true,

        message:
          "Answer saved successfully",

        interviewId,

        questionIndex,

        answeredQuestions,

        answer: cleanAnswer,
      });
    } catch (error) {
      console.error(
        "Save Mock Interview Answer Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to save interview answer",
      });
    }
  };

// ==========================================
// EVALUATE COMPLETE MOCK INTERVIEW
// ==========================================

export const evaluateMockInterview =
  async (req, res) => {
    try {
      const uid = req.uid;

      const {
        interviewId,
        answers,
      } = req.body;

      console.log(
        "1. Mock interview evaluation started:",
        interviewId
      );

      // ======================================
      // 1. BASIC VALIDATION
      // ======================================

      if (!interviewId) {
        return res.status(400).json({
          success: false,

          message:
            "Interview ID is required",
        });
      }

      if (
        !Array.isArray(answers)
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Interview answers are required",
        });
      }

      // ======================================
      // 2. GET ORIGINAL INTERVIEW
      // ======================================

      const interviewRef =
        db.ref(
          `users/${uid}/mockInterviews/${interviewId}`
        );

      const snapshot =
        await interviewRef.once(
          "value"
        );

      if (!snapshot.exists()) {
        return res.status(404).json({
          success: false,

          message:
            "Mock interview not found",
        });
      }

      const interview =
        snapshot.val();

      // ======================================
      // 3. ALREADY EVALUATED?
      // ======================================
      // Prevent duplicate Gemini usage.
      // ======================================

      if (
        interview.status ===
          "completed" &&
        interview.overallScore !==
          null &&
        interview.overallScore !==
          undefined
      ) {
        console.log(
          "2. Existing evaluation found"
        );

        console.log(
          "3. Gemini evaluation skipped"
        );

        return res.status(200).json({
          success: true,

          message:
            "Existing interview evaluation loaded successfully",

          cached: true,

          interviewId:
            interview.interviewId,

          type:
            interview.type,

          status:
            interview.status,

          overallScore:
            interview.overallScore,

          overallFeedback:
            interview.overallFeedback ||
            "",

          strengths:
            interview.strengths ||
            [],

          improvements:
            interview.improvements ||
            [],

          questions:
            normalizeQuestions(
              interview.questions
            ),

          completedAt:
            interview.completedAt,
        });
      }

      // ======================================
      // 4. VALIDATE ORIGINAL QUESTIONS
      // ======================================

      const originalQuestions =
        normalizeQuestions(
          interview.questions
        );

      if (
        originalQuestions.length === 0
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Interview questions are missing",
        });
      }

      if (
        answers.length !==
        originalQuestions.length
      ) {
        return res.status(400).json({
          success: false,

          message:
            `Please answer all ${originalQuestions.length} interview questions`,
        });
      }

      // ======================================
      // 5. BUILD ANSWERS SAFELY
      // ======================================
      // Questions always come from Firebase.
      // Frontend cannot replace questions.
      // ======================================

      const questionsForEvaluation =
        originalQuestions.map(
          (item, index) => {
            const submitted =
              answers[index];

            let answerText = "";

            if (
              typeof submitted ===
              "string"
            ) {
              answerText =
                submitted.trim();
            } else if (
              submitted &&
              typeof submitted.answer ===
                "string"
            ) {
              answerText =
                submitted.answer.trim();
            }

            return {
              questionNumber:
                index + 1,

              question:
                item.question,

              answer:
                answerText,
            };
          }
        );

      // ======================================
      // 6. CHECK EMPTY ANSWERS
      // ======================================

      const hasEmptyAnswer =
        questionsForEvaluation.some(
          (item) =>
            !item.answer
        );

      if (hasEmptyAnswer) {
        return res.status(400).json({
          success: false,

          message:
            "Please answer all interview questions before evaluation",
        });
      }

      console.log(
        "2. All answers validated"
      );

      // ======================================
      // 7. GEMINI EVALUATION
      // ======================================

      console.log(
        "3. Sending complete interview for AI evaluation"
      );

      const evaluation =
        await evaluateInterviewAnswers(
          interview.type,
          questionsForEvaluation
        );

      console.log(
        "4. AI evaluation completed"
      );

      // ======================================
      // 8. VALIDATE AI EVALUATION
      // ======================================

      if (
        !evaluation ||
        !Array.isArray(
          evaluation.evaluations
        ) ||
        evaluation.evaluations.length !==
          originalQuestions.length
      ) {
        throw Object.assign(
          new Error(
            "AI returned an incomplete interview evaluation."
          ),
          {
            status: 500,
          }
        );
      }

      // ======================================
      // 9. MERGE QUESTION + ANSWER + FEEDBACK
      // ======================================

      const evaluatedQuestions =
        originalQuestions.map(
          (item, index) => {
            const result =
              evaluation.evaluations[
                index
              ];

            return {
              questionNumber:
                index + 1,

              question:
                item.question,

              answer:
                questionsForEvaluation[
                  index
                ].answer,

              answered: true,

              feedback: {
                score:
                  Number(
                    result?.score
                  ) || 0,

                feedback:
                  result?.feedback ||
                  "",

                improvement:
                  result?.improvement ||
                  "",
              },
            };
          }
        );

      const completedAt =
        new Date().toISOString();

      // ======================================
      // 10. PREPARE FIREBASE UPDATE
      // ======================================

      const completedInterview = {
        status: "completed",

        currentQuestion:
          originalQuestions.length,

        answeredQuestions:
          originalQuestions.length,

        questions:
          evaluatedQuestions,

        overallScore:
          Number(
            evaluation.overallScore
          ) || 0,

        overallFeedback:
          evaluation.overallFeedback ||
          "",

        strengths:
          Array.isArray(
            evaluation.strengths
          )
            ? evaluation.strengths
            : [],

        improvements:
          Array.isArray(
            evaluation.improvements
          )
            ? evaluation.improvements
            : [],

        completedAt,
      };

      // ======================================
      // 11. SAVE EVALUATION
      // ======================================

      await interviewRef.update(
        completedInterview
      );

      console.log(
        "5. Interview evaluation saved:",
        interviewId
      );

      // ======================================
      // RESPONSE
      // ======================================

      return res.status(200).json({
        success: true,

        message:
          "Mock interview evaluated successfully",

        cached: false,

        interviewId,

        type:
          interview.type,

        ...completedInterview,
      });
    } catch (error) {
      console.error(
        "Evaluate Mock Interview Error:",
        error
      );

      const status =
        getErrorStatus(error);

      // ======================================
      // GEMINI DAILY QUOTA / RATE LIMIT
      // ======================================

      if (status === 429) {
        return res.status(429).json({
          success: false,

          message:
            error?.message ||
            "Daily AI quota reached. Your answers are saved. Please try evaluation again later.",
        });
      }

      // ======================================
      // GEMINI TEMPORARILY UNAVAILABLE
      // ======================================

      if (
        status === 502 ||
        status === 503 ||
        status === 504
      ) {
        return res.status(status).json({
          success: false,

          message:
            "AI service is temporarily busy. Your answers are saved. Please try evaluation again later.",
        });
      }

      // ======================================
      // OTHER ERROR
      // ======================================

      return res.status(500).json({
        success: false,

        message:
          error?.message ||
          "Failed to evaluate mock interview",
      });
    }
  };

// ==========================================
// GET MOCK INTERVIEW HISTORY
// ==========================================

export const getMockInterviewHistory =
  async (req, res) => {
    try {
      const uid = req.uid;

      const snapshot =
        await db
          .ref(
            `users/${uid}/mockInterviews`
          )
          .once("value");

      if (!snapshot.exists()) {
        return res.status(200).json({
          success: true,

          count: 0,

          history: [],
        });
      }

      const history =
        Object.values(
          snapshot.val()
        );

      history.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

      return res.status(200).json({
        success: true,

        count:
          history.length,

        history,
      });
    } catch (error) {
      console.error(
        "Get Mock Interview History Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch mock interview history",

        error:
          error.message,
      });
    }
  };