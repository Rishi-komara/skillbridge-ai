import {
  useEffect,
  useState,
} from "react";

import PageLayout from "../components/PageLayout";
import apiClient from "../config/api";

// ==========================================
// ICONS
// ==========================================

const InterviewIcon = ({
  type,
  size = 20,
}) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    mic: (
      <>
        <rect
          x="9"
          y="3"
          width="6"
          height="11"
          rx="3"
        />
        <path d="M5 11a7 7 0 0 0 14 0" />
        <path d="M12 18v3" />
        <path d="M9 21h6" />
      </>
    ),

    volume: (
      <>
        <path d="M11 5 6 9H3v6h3l5 4V5z" />
        <path d="M15 9a4 4 0 0 1 0 6" />
        <path d="M18 6a8 8 0 0 1 0 12" />
      </>
    ),

    technical: (
      <>
        <path d="m8 9-4 3 4 3" />
        <path d="m16 9 4 3-4 3" />
        <path d="m14 5-4 14" />
      </>
    ),

    hr: (
      <>
        <circle
          cx="12"
          cy="8"
          r="4"
        />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),

    dsa: (
      <>
        <rect
          x="3"
          y="3"
          width="6"
          height="6"
          rx="1"
        />
        <rect
          x="15"
          y="3"
          width="6"
          height="6"
          rx="1"
        />
        <rect
          x="9"
          y="15"
          width="6"
          height="6"
          rx="1"
        />
        <path d="M6 9v2h12V9" />
        <path d="M12 11v4" />
      </>
    ),

    check: (
      <>
        <circle
          cx="12"
          cy="12"
          r="9"
        />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),

    arrowLeft: (
      <path d="m15 18-6-6 6-6" />
    ),

    arrowRight: (
      <path d="m9 18 6 6 6-6" />
    ),

    info: (
      <>
        <circle
          cx="12"
          cy="12"
          r="9"
        />
        <path d="M12 11v5" />
        <path d="M12 8h.01" />
      </>
    ),

    spark: (
      <>
        <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3z" />
        <path d="m18 14 .8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14z" />
      </>
    ),

    trophy: (
      <>
        <path d="M8 4h8v5a4 4 0 0 1-8 0V4z" />
        <path d="M8 6H4v2a4 4 0 0 0 4 4" />
        <path d="M16 6h4v2a4 4 0 0 1-4 4" />
        <path d="M12 13v4" />
        <path d="M8 21h8" />
        <path d="M9 17h6v4H9z" />
      </>
    ),
  };

  return (
    <svg {...common}>
      {icons[type]}
    </svg>
  );
};

// ==========================================
// NORMALIZE FIREBASE QUESTIONS
// ==========================================

const normalizeQuestions = (
  questions
) => {
  if (Array.isArray(questions)) {
    return questions;
  }

  if (
    questions &&
    typeof questions === "object"
  ) {
    return Object.values(
      questions
    ).sort(
      (a, b) =>
        Number(
          a.questionNumber || 0
        ) -
        Number(
          b.questionNumber || 0
        )
    );
  }

  return [];
};

// ==========================================
// MOCK INTERVIEW
// ==========================================

function MockInterview() {
  const [
    activeTab,
    setActiveTab,
  ] = useState("Technical");

  const [
    questions,
    setQuestions,
  ] = useState([]);

  const [
    interviewId,
    setInterviewId,
  ] = useState(null);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [
    answer,
    setAnswer,
  ] = useState("");

  const [
    answers,
    setAnswers,
  ] = useState({});

  const [
    isStarting,
    setIsStarting,
  ] = useState(false);

  const [
    startError,
    setStartError,
  ] = useState("");

  const [
    isListening,
    setIsListening,
  ] = useState(false);

  const [
    transcript,
    setTranscript,
  ] = useState("");

  // ==========================================
  // RESTORE STATE
  // ==========================================

  const [
    isRestoring,
    setIsRestoring,
  ] = useState(true);

  const [
    restoredSession,
    setRestoredSession,
  ] = useState(false);

  // ==========================================
  // EVALUATION STATE
  // ==========================================

  const [
    isEvaluating,
    setIsEvaluating,
  ] = useState(false);

  const [
    evaluationError,
    setEvaluationError,
  ] = useState("");

  const [
    evaluation,
    setEvaluation,
  ] = useState(null);

  // ==========================================
  // VALUES
  // ==========================================

  const currentQuestion =
    questions[currentIndex]
      ?.question || "";

  const totalQuestions =
    questions.length;

  const questionProgress =
    totalQuestions > 0
      ? ((currentIndex + 1) /
          totalQuestions) *
        100
      : 0;

  const answeredCount =
    questions.reduce(
      (count, _, index) =>
        answers[index]?.trim()
          ? count + 1
          : count,
      0
    );

  const currentAnswerSaved =
    Boolean(
      answers[
        currentIndex
      ]?.trim()
    );

  const tabIcons = {
    Technical: "technical",
    HR: "hr",
    DSA: "dsa",
  };

  // ==========================================
  // RESET LOCAL INTERVIEW
  // ==========================================

  const resetInterview = () => {
    window.speechSynthesis?.cancel();

    setQuestions([]);
    setInterviewId(null);
    setCurrentIndex(0);
    setAnswer("");
    setAnswers({});
    setTranscript("");
    setStartError("");
    setEvaluationError("");
    setEvaluation(null);
    setRestoredSession(false);
  };

  // ==========================================
  // RESTORE LATEST IN-PROGRESS INTERVIEW
  // ==========================================

  useEffect(() => {
    const restoreInterview =
      async () => {
        try {
          setIsRestoring(true);

          const response =
            await apiClient.get(
              "/mock-interview/history"
            );

          const history =
            Array.isArray(
              response.data?.history
            )
              ? response.data.history
              : [];

          // ------------------------------------
          // ONLY unfinished interview
          // ------------------------------------

          const inProgress =
            history.find(
              (item) =>
                item?.status ===
                "in-progress"
            );

          // ------------------------------------
          // No unfinished session.
          // Show normal Start screen.
          // Completed interviews are NOT restored.
          // ------------------------------------

          if (!inProgress) {
            return;
          }

          const restoredQuestions =
            normalizeQuestions(
              inProgress.questions
            );

          if (
            restoredQuestions.length ===
            0
          ) {
            return;
          }

          // ------------------------------------
          // Restore saved answers if Firebase
          // already contains any.
          // ------------------------------------

          const restoredAnswers = {};

          restoredQuestions.forEach(
            (item, index) => {
              if (
                typeof item.answer ===
                  "string" &&
                item.answer.trim()
              ) {
                restoredAnswers[index] =
                  item.answer.trim();
              }
            }
          );

          // ------------------------------------
          // Find first unanswered question
          // ------------------------------------

          let resumeIndex =
            restoredQuestions.findIndex(
              (_, index) =>
                !restoredAnswers[
                  index
                ]
            );

          if (resumeIndex === -1) {
            resumeIndex = 0;
          }

          setActiveTab(
            inProgress.type ||
              "Technical"
          );

          setInterviewId(
            inProgress.interviewId
          );

          setQuestions(
            restoredQuestions
          );

          setAnswers(
            restoredAnswers
          );

          setCurrentIndex(
            resumeIndex
          );

          setAnswer(
            restoredAnswers[
              resumeIndex
            ] || ""
          );

          setRestoredSession(true);

          console.log(
            "Mock interview restored:",
            inProgress.interviewId
          );
        } catch (error) {
          console.error(
            "Restore Mock Interview Error:",
            error
          );

          // History failure should not block
          // starting a fresh interview.
        } finally {
          setIsRestoring(false);
        }
      };

    restoreInterview();
  }, []);

  // ==========================================
  // CHANGE CATEGORY
  // ==========================================

  const handleTabChange = (
    tab
  ) => {
    if (
      isStarting ||
      isEvaluating ||
      isRestoring
    ) {
      return;
    }

    // If an interview is already active,
    // don't silently throw it away.
    if (
      questions.length > 0 &&
      !evaluation
    ) {
      return;
    }

    setActiveTab(tab);
    resetInterview();
  };

  // ==========================================
  // START NEW INTERVIEW
  // ==========================================

  const startInterview =
    async () => {
      if (
        isStarting ||
        isEvaluating ||
        isRestoring
      ) {
        return;
      }

      try {
        setIsStarting(true);
        setStartError("");

        resetInterview();

        const response =
          await apiClient.post(
            "/mock-interview/start",
            {
              type: activeTab,
            }
          );

        const data =
          response.data;

        const generatedQuestions =
          normalizeQuestions(
            data?.questions
          );

        if (
          !data?.success ||
          generatedQuestions.length ===
            0
        ) {
          throw new Error(
            "Interview questions were not returned."
          );
        }

        setInterviewId(
          data.interviewId
        );

        setQuestions(
          generatedQuestions
        );
      } catch (error) {
        console.error(
          "Start Mock Interview Error:",
          error
        );

        setStartError(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Failed to start mock interview."
        );
      } finally {
        setIsStarting(false);
      }
    };

  // // ==========================================
// SPEECH RECOGNITION
// ==========================================

const startListening = () => {
  if (
    !currentQuestion ||
    evaluation ||
    isListening
  ) {
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert(
      "Speech Recognition is not supported in this browser."
    );
    return;
  }

  const recognition =
    new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  // Keep whatever is already present
  // in the textarea before starting mic.
  const previousAnswer =
    answer.trim();

  setIsListening(true);

  recognition.start();

  recognition.onresult = (
    event
  ) => {
    const newText =
      event.results[0][0]
        .transcript
        .trim();

    // Add new speech AFTER old answer
    // instead of replacing it.
    const combinedAnswer =
      previousAnswer
        ? `${previousAnswer} ${newText}`
        : newText;

    setAnswer(combinedAnswer);

    // Transcript can show the latest
    // microphone recording only.
    setTranscript(newText);
  };

  recognition.onerror = (
    event
  ) => {
    console.error(
      "Speech Recognition Error:",
      event.error
    );

    setIsListening(false);
  };

  recognition.onend = () => {
    setIsListening(false);
  };
};

  // ==========================================
  // READ QUESTION
  // ==========================================

  const speakQuestion = () => {
    if (!currentQuestion) {
      return;
    }

    if (
      !(
        "speechSynthesis" in
        window
      )
    ) {
      alert(
        "Text-to-speech is not supported in this browser."
      );

      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(
        currentQuestion
      );

    speech.rate = 1;

    window.speechSynthesis.speak(
      speech
    );
  };

  // ==========================================
// SAVE ANSWER TO FIREBASE
// ==========================================

const submitAnswer = async () => {
  if (
    !answer.trim() ||
    !currentQuestion ||
    !interviewId ||
    evaluation
  ) {
    return;
  }

  try {
    setEvaluationError("");

    const cleanAnswer =
      answer.trim();

    const response =
      await apiClient.patch(
        `/mock-interview/${interviewId}/answer`,
        {
          questionIndex:
            currentIndex,

          answer: cleanAnswer,
        }
      );

    if (
      !response.data?.success
    ) {
      throw new Error(
        "Answer could not be saved."
      );
    }

    // Update frontend only AFTER
    // Firebase save succeeds.
    setAnswers(
      (previous) => ({
        ...previous,

        [currentIndex]:
          cleanAnswer,
      })
    );

    console.log(
      `Question ${
        currentIndex + 1
      } answer saved`
    );
  } catch (error) {
    console.error(
      "Save Interview Answer Error:",
      error
    );

    setEvaluationError(
      error?.response?.data
        ?.message ||
        error?.message ||
        "Failed to save answer. Please try again."
    );
  }
};

  // ==========================================
  // LOAD QUESTION
  // ==========================================

  const loadQuestion = (
    index,
    answerSource = answers
  ) => {
    window.speechSynthesis?.cancel();

    setCurrentIndex(index);

    setAnswer(
      answerSource[index] || ""
    );

    setTranscript("");
  };

  // ==========================================
  // PREVIOUS
  // ==========================================

  const prevQuestion = () => {
    if (currentIndex <= 0) {
      return;
    }

    loadQuestion(
      currentIndex - 1
    );
  };

  // ==========================================
  // NEXT
  // ==========================================

  const nextQuestion = () => {
    if (
      currentIndex >=
      totalQuestions - 1
    ) {
      return;
    }

    loadQuestion(
      currentIndex + 1
    );
  };

  // ==========================================
  // FINISH + EVALUATE
  // ==========================================

  const finishAndEvaluate =
    async () => {
      if (
        isEvaluating ||
        !interviewId ||
        evaluation
      ) {
        return;
      }

      try {
        setEvaluationError("");

        // --------------------------------------
        // Include current textarea even if
        // Save Answer was not clicked.
        // --------------------------------------

        const latestAnswers = {
          ...answers,
        };

        if (answer.trim()) {
          latestAnswers[
            currentIndex
          ] = answer.trim();
        }

        // --------------------------------------
        // Validate before Gemini call
        // --------------------------------------

        const missingIndex =
          questions.findIndex(
            (_, index) =>
              !latestAnswers[
                index
              ]?.trim()
          );

        if (
          missingIndex !== -1
        ) {
          setAnswers(
            latestAnswers
          );

          setEvaluationError(
            `Please answer Question ${
              missingIndex + 1
            } before finishing the interview.`
          );

          loadQuestion(
            missingIndex,
            latestAnswers
          );

          return;
        }

        setAnswers(
          latestAnswers
        );

        setIsEvaluating(true);

        const submittedAnswers =
          questions.map(
            (_, index) =>
              latestAnswers[
                index
              ].trim()
          );

        const response =
          await apiClient.post(
            "/mock-interview/evaluate",
            {
              interviewId,
              answers:
                submittedAnswers,
            }
          );

        const data =
          response.data;

        if (
          !data?.success ||
          typeof data.overallScore !==
            "number"
        ) {
          throw new Error(
            "Interview evaluation was not returned."
          );
        }

        setEvaluation(data);
        setRestoredSession(false);

        window.speechSynthesis?.cancel();

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } catch (error) {
        console.error(
          "Evaluate Mock Interview Error:",
          error
        );

        setEvaluationError(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Failed to evaluate mock interview."
        );
      } finally {
        setIsEvaluating(false);
      }
    };

  // ==========================================
  // START ANOTHER
  // ==========================================

  const startAnotherInterview =
    () => {
      resetInterview();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  // ==========================================
  // LOADING HISTORY
  // ==========================================

  if (isRestoring) {
    return (
      <PageLayout
        title="Mock Interview"
        subtitle="Practice placement interview questions generated with AI using text or voice."
      >
        <section className="sb-card p-8 mt-5">
          <div className="max-w-[520px] mx-auto text-center py-8">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#e8f5f1] text-[#0f766e] flex items-center justify-center">
              <InterviewIcon
                type="spark"
                size={20}
              />
            </div>

            <h2 className="m-0 mt-4 text-[17px] font-semibold text-[#163b38]">
              Checking your interview
            </h2>

            <p className="m-0 mt-2 text-[10px] text-[#71817e]">
              Looking for an
              unfinished practice
              session...
            </p>
          </div>
        </section>
      </PageLayout>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <PageLayout
      title="Mock Interview"
      subtitle="Practice placement interview questions generated with AI using text or voice."
    >
      {/* ====================================
          CATEGORY
      ==================================== */}

      <section className="sb-card p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f766e]">
              AI Mock Interview
            </p>

            <h2 className="m-0 mt-1 text-[17px] font-semibold text-[#163b38]">
              Choose an interview
              category
            </h2>

            <p className="m-0 mt-1 text-[11px] text-[#91a09d]">
              Technical, HR or DSA
              placement interview
              practice.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              "Technical",
              "HR",
              "DSA",
            ].map((tab) => (
              <button
                key={tab}
                type="button"
                disabled={
                  isStarting ||
                  isEvaluating ||
                  (questions.length >
                    0 &&
                    !evaluation)
                }
                onClick={() =>
                  handleTabChange(
                    tab
                  )
                }
                className={`
                  inline-flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-xl
                  border
                  text-[11px]
                  font-semibold
                  transition-all
                  duration-200
                  disabled:opacity-50
                  disabled:cursor-not-allowed

                  ${
                    activeTab ===
                    tab
                      ? `
                        bg-[#0f766e]
                        border-[#0f766e]
                        text-white
                      `
                      : `
                        bg-white
                        border-[#e2ebe7]
                        text-[#617572]
                        hover:bg-[#f4f8f6]
                      `
                  }
                `}
              >
                <InterviewIcon
                  type={
                    tabIcons[tab]
                  }
                  size={15}
                />

                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================
          START SCREEN
      ==================================== */}

      {questions.length === 0 &&
        !evaluation && (
          <section className="sb-card p-6 sm:p-8 mt-5">
            <div className="max-w-[620px] mx-auto text-center py-5">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#e8f5f1] text-[#0f766e] flex items-center justify-center">
                <InterviewIcon
                  type="spark"
                  size={20}
                />
              </div>

              <h2 className="m-0 mt-4 text-[19px] font-semibold text-[#163b38]">
                Start {activeTab}{" "}
                Interview
              </h2>

              <p className="m-0 mt-2 text-[11px] leading-5 text-[#71817e]">
                SkillBridge AI will
                generate 5 new
                placement-focused{" "}
                {activeTab} questions.
              </p>

              {startError && (
                <div className="mt-5 p-3.5 rounded-xl border border-[#f0d7d2] bg-[#fff5f3] text-[#a95750] text-[10px] leading-5 text-left">
                  {startError}
                </div>
              )}

              <button
                type="button"
                onClick={
                  startInterview
                }
                disabled={
                  isStarting
                }
                className="sb-btn-primary min-h-[42px] px-5 mt-5 text-[11px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <InterviewIcon
                  type="spark"
                  size={15}
                />

                {isStarting
                  ? "Generating Questions..."
                  : "Start AI Interview"}
              </button>

              <p className="m-0 mt-3 text-[9px] text-[#91a09d]">
                A new interview uses
                one AI question-generation
                request.
              </p>
            </div>
          </section>
        )}

      {/* ====================================
          ACTIVE INTERVIEW
      ==================================== */}

      {questions.length > 0 &&
        !evaluation && (
          <>
            {/* RESTORED NOTICE */}

            {restoredSession && (
              <div className="mt-5 p-4 rounded-xl bg-[#edf8ee] border border-[#d8ebda] text-[#39894a]">
                <div className="flex items-start gap-2">
                  <InterviewIcon
                    type="check"
                    size={15}
                  />

                  <div>
                    <p className="m-0 text-[11px] font-semibold">
                      Interview
                      restored
                    </p>

                    <p className="m-0 mt-1 text-[9px] leading-4">
                      Your unfinished{" "}
                      {activeTab}{" "}
                      interview was loaded
                      from your previous
                      session. No new AI
                      questions were
                      generated.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* QUESTION */}

            <section className="sb-card p-5 sm:p-6 mt-5">
              <div className="flex items-center justify-between gap-4 mb-2">
                <p className="m-0 text-[10px] font-semibold text-[#71817e]">
                  Question{" "}
                  {currentIndex + 1}{" "}
                  of {totalQuestions}
                </p>

                <p className="m-0 text-[10px] font-semibold text-[#0f766e]">
                  {Math.round(
                    questionProgress
                  )}
                  %
                </p>
              </div>

              <div className="h-2 rounded-full overflow-hidden bg-[#edf2f0]">
                <div
                  className="h-full rounded-full bg-[#0f766e] transition-all duration-500"
                  style={{
                    width: `${questionProgress}%`,
                  }}
                />
              </div>

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mt-6">
                <div className="max-w-3xl">
                  <span className="inline-flex px-2.5 py-1 mb-3 rounded-full bg-[#e8f5f1] text-[#0f766e] text-[9px] font-bold uppercase tracking-wide">
                    {activeTab}{" "}
                    Question
                  </span>

                  <h2 className="m-0 text-[20px] sm:text-[22px] leading-8 font-semibold tracking-[-0.3px] text-[#163b38]">
                    {currentQuestion}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={
                    speakQuestion
                  }
                  className="sb-btn-secondary self-start min-h-[40px] px-4 text-[11px]"
                >
                  <InterviewIcon
                    type="volume"
                    size={16}
                  />

                  Read Question
                </button>
              </div>

              {/* ANSWER */}

              <div className="mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                  <label
                    htmlFor="interview-answer"
                    className="text-[11px] font-semibold text-[#526562]"
                  >
                    Your Answer
                  </label>

                  <button
                    type="button"
                    onClick={
                      startListening
                    }
                    disabled={
                      isListening ||
                      isEvaluating
                    }
                    className={`
                      inline-flex
                      items-center
                      gap-2
                      self-start
                      px-3.5
                      py-2
                      rounded-lg
                      border
                      text-[10px]
                      font-semibold
                      transition-all
                      disabled:opacity-50

                      ${
                        isListening
                          ? `
                            bg-[#fff3f1]
                            border-[#f0d7d2]
                            text-[#b65d55]
                          `
                          : `
                            bg-[#f3f8f6]
                            border-[#dce9e4]
                            text-[#0f766e]
                            hover:bg-[#e8f5f1]
                          `
                      }
                    `}
                  >
                    <InterviewIcon
                      type="mic"
                      size={15}
                    />

                    {isListening
                      ? "Listening..."
                      : "Answer by Voice"}
                  </button>
                </div>

                <textarea
                  id="interview-answer"
                  rows="7"
                  maxLength={5000}
                  value={answer}
                  disabled={
                    isEvaluating
                  }
                  onChange={(
                    event
                  ) =>
                    setAnswer(
                      event.target
                        .value
                    )
                  }
                  placeholder="Type your answer here or use the microphone..."
                  className="sb-input w-full min-h-[170px] resize-y leading-6 disabled:opacity-60"
                />

                <div className="flex items-center justify-between gap-4 mt-2">
                  <p className="m-0 text-[9px] text-[#91a09d]">
                    Answer clearly and
                    include examples
                    where possible.
                  </p>

                  <p className="m-0 text-[9px] text-[#91a09d]">
                    {answer.length}
                    /5000
                  </p>
                </div>
              </div>

              {/* TRANSCRIPT */}

              {transcript && (
                <div className="mt-4 p-4 rounded-xl bg-[#f8fbfa] border border-[#e7efec]">
                  <div className="flex items-center gap-2 mb-2 text-[#0f766e]">
                    <InterviewIcon
                      type="mic"
                      size={14}
                    />

                    <p className="m-0 text-[10px] font-semibold">
                      Voice
                      Transcript
                    </p>
                  </div>

                  <p className="m-0 text-[11px] leading-5 text-[#617572]">
                    {transcript}
                  </p>
                </div>
              )}

              {/* SAVED STATUS */}

              {currentAnswerSaved && (
                <div className="mt-4 p-3 rounded-xl bg-[#edf8ee] border border-[#d8ebda] text-[#39894a] text-[10px] font-medium">
                  Answer saved for
                  this question.
                </div>
              )}

              {/* BUTTONS */}

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-6 pt-5 border-t border-[#edf2f0]">
                <button
                  type="button"
                  onClick={
                    prevQuestion
                  }
                  disabled={
                    currentIndex ===
                      0 ||
                    isEvaluating
                  }
                  className="sb-btn-secondary min-h-[42px] px-4 text-[11px] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <InterviewIcon
                    type="arrowLeft"
                    size={15}
                  />

                  Previous
                </button>

                <button
                  type="button"
                  onClick={
                    submitAnswer
                  }
                  disabled={
                    !answer.trim() ||
                    isEvaluating
                  }
                  className="sb-btn-primary min-h-[42px] px-5 text-[11px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <InterviewIcon
                    type="check"
                    size={15}
                  />

                  {currentAnswerSaved
                    ? "Update Answer"
                    : "Save Answer"}
                </button>

                <button
                  type="button"
                  onClick={
                    nextQuestion
                  }
                  disabled={
                    currentIndex ===
                      totalQuestions -
                        1 ||
                    isEvaluating
                  }
                  className="sb-btn-secondary sm:ml-auto min-h-[42px] px-4 text-[11px] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next

                  <InterviewIcon
                    type="arrowRight"
                    size={15}
                  />
                </button>
              </div>
            </section>

            {/* FINISH */}

            <section className="sb-card p-5 sm:p-6 mt-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div>
                  <h2 className="m-0 text-[15px] font-semibold text-[#163b38]">
                    Finish Interview
                  </h2>

                  <p className="m-0 mt-1 text-[10px] leading-5 text-[#71817e]">
                    Complete all 5
                    answers. AI will
                    evaluate the full
                    interview in one
                    request.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="px-4 py-2.5 rounded-xl bg-[#f4f8f6] border border-[#e2ebe7]">
                    <p className="m-0 text-[9px] uppercase tracking-wide font-semibold text-[#91a09d]">
                      Answers
                    </p>

                    <p className="m-0 mt-1 text-[15px] font-semibold text-[#163b38]">
                      {answeredCount}/
                      {totalQuestions}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      finishAndEvaluate
                    }
                    disabled={
                      isEvaluating
                    }
                    className="sb-btn-primary min-h-[44px] px-5 text-[11px] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <InterviewIcon
                      type="spark"
                      size={15}
                    />

                    {isEvaluating
                      ? "Evaluating..."
                      : "Finish & Evaluate"}
                  </button>
                </div>
              </div>

              {evaluationError && (
                <div className="mt-4 p-3.5 rounded-xl border border-[#f0d7d2] bg-[#fff5f3] text-[#a95750] text-[10px] leading-5">
                  {evaluationError}
                </div>
              )}

              <div className="flex items-start gap-2 mt-4 pt-4 border-t border-[#edf2f0] text-[#91a09d]">
                <InterviewIcon
                  type="info"
                  size={13}
                />

                <p className="m-0 text-[9px] leading-4">
                  Interview ID:{" "}
                  {interviewId}.
                  Unfinished interviews
                  are restored after a
                  page refresh.
                </p>
              </div>
            </section>
          </>
        )}

      {/* ====================================
          RESULTS
      ==================================== */}

      {evaluation && (
        <>
          {/* SCORE */}

          <section className="sb-card p-5 sm:p-7 mt-5">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="w-[110px] h-[110px] shrink-0 rounded-full bg-[#e8f5f1] border-[8px] border-[#d5ece5] flex flex-col items-center justify-center">
                <span className="text-[28px] font-bold text-[#0f766e]">
                  {
                    evaluation.overallScore
                  }
                </span>

                <span className="text-[9px] font-semibold text-[#71817e]">
                  / 100
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 text-[#0f766e]">
                  <InterviewIcon
                    type="trophy"
                    size={18}
                  />

                  <p className="m-0 text-[10px] uppercase tracking-[0.1em] font-bold">
                    AI Practice
                    Evaluation
                  </p>
                </div>

                <h2 className="m-0 mt-2 text-[21px] font-semibold text-[#163b38]">
                  Interview
                  Completed
                </h2>

                <p className="m-0 mt-2 max-w-[760px] text-[11px] leading-6 text-[#617572]">
                  {evaluation.overallFeedback ||
                    "Your answers have been evaluated."}
                </p>

                <p className="m-0 mt-2 text-[9px] leading-4 text-[#91a09d]">
                  This is an AI
                  practice evaluation,
                  not a hiring decision
                  or employability
                  prediction.
                </p>
              </div>
            </div>
          </section>

          {/* STRENGTHS */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
            <section className="sb-card p-5 sm:p-6">
              <h2 className="m-0 text-[15px] font-semibold text-[#163b38]">
                Strengths
              </h2>

              <div className="mt-4 space-y-3">
                {evaluation
                  .strengths
                  ?.length > 0 ? (
                  evaluation.strengths.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="flex items-start gap-3 p-3 rounded-xl bg-[#f4faf7] border border-[#e2eee8]"
                      >
                        <div className="mt-[2px] text-[#4caf50]">
                          <InterviewIcon
                            type="check"
                            size={
                              14
                            }
                          />
                        </div>

                        <p className="m-0 text-[10px] leading-5 text-[#526562]">
                          {
                            item
                          }
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p className="m-0 text-[10px] text-[#91a09d]">
                    No overall
                    strengths were
                    returned.
                  </p>
                )}
              </div>
            </section>

            {/* IMPROVEMENTS */}

            <section className="sb-card p-5 sm:p-6">
              <h2 className="m-0 text-[15px] font-semibold text-[#163b38]">
                Areas to Improve
              </h2>

              <div className="mt-4 space-y-3">
                {evaluation
                  .improvements
                  ?.length > 0 ? (
                  evaluation.improvements.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="flex items-start gap-3 p-3 rounded-xl bg-[#fffaf4] border border-[#f0e6d7]"
                      >
                        <div className="mt-[2px] text-[#9b7447]">
                          <InterviewIcon
                            type="info"
                            size={
                              14
                            }
                          />
                        </div>

                        <p className="m-0 text-[10px] leading-5 text-[#526562]">
                          {
                            item
                          }
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p className="m-0 text-[10px] text-[#91a09d]">
                    No overall
                    improvements
                    were returned.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* QUESTION FEEDBACK */}

          <section className="sb-card p-5 sm:p-6 mt-5">
            <p className="m-0 text-[10px] uppercase tracking-[0.1em] font-bold text-[#0f766e]">
              Detailed Evaluation
            </p>

            <h2 className="m-0 mt-1 text-[17px] font-semibold text-[#163b38]">
              Question-wise
              Feedback
            </h2>

            <div className="mt-5 space-y-4">
              {normalizeQuestions(
                evaluation.questions
              ).map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      item.questionNumber ||
                      index
                    }
                    className="rounded-2xl border border-[#e2ebe7] overflow-hidden"
                  >
                    <div className="p-4 sm:p-5 bg-[#f8fbfa] border-b border-[#e7efec]">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <p className="m-0 text-[9px] uppercase tracking-wide font-bold text-[#0f766e]">
                            Question{" "}
                            {item.questionNumber ||
                              index +
                                1}
                          </p>

                          <h3 className="m-0 mt-1 text-[13px] leading-6 font-semibold text-[#163b38]">
                            {
                              item.question
                            }
                          </h3>
                        </div>

                        <div className="shrink-0 px-3 py-2 rounded-xl bg-[#e8f5f1] text-center">
                          <p className="m-0 text-[16px] font-bold text-[#0f766e]">
                            {item
                              .feedback
                              ?.score ??
                              0}
                          </p>

                          <p className="m-0 text-[8px] font-semibold text-[#71817e]">
                            /100
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5">
                      <div>
                        <p className="m-0 text-[9px] uppercase tracking-wide font-semibold text-[#91a09d]">
                          Your Answer
                        </p>

                        <p className="m-0 mt-1 text-[10px] leading-5 text-[#526562]">
                          {
                            item.answer
                          }
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-[#edf2f0]">
                        <p className="m-0 text-[9px] uppercase tracking-wide font-semibold text-[#91a09d]">
                          AI Feedback
                        </p>

                        <p className="m-0 mt-1 text-[10px] leading-5 text-[#526562]">
                          {item
                            .feedback
                            ?.feedback ||
                            "No feedback returned."}
                        </p>
                      </div>

                      <div className="mt-4 p-3.5 rounded-xl bg-[#fffaf4] border border-[#f0e6d7]">
                        <p className="m-0 text-[9px] uppercase tracking-wide font-semibold text-[#9b7447]">
                          How to
                          Improve
                        </p>

                        <p className="m-0 mt-1 text-[10px] leading-5 text-[#617572]">
                          {item
                            .feedback
                            ?.improvement ||
                            "No specific improvement returned."}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          {/* COMPLETED */}

          <section className="sb-card p-5 sm:p-6 mt-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="m-0 text-[15px] font-semibold text-[#163b38]">
                  Session Complete
                </h2>

                <p className="m-0 mt-1 text-[10px] leading-5 text-[#71817e]">
                  This interview is
                  completed. Starting
                  another interview
                  will generate fresh
                  questions.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  startAnotherInterview
                }
                className="sb-btn-secondary min-h-[42px] px-5 text-[11px]"
              >
                Start Another
                Interview
              </button>
            </div>
          </section>
        </>
      )}
    </PageLayout>
  );
}

export default MockInterview;