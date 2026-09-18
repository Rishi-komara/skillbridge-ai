import { useEffect, useState } from "react";

import Toast from "../components/Toast";
import PageLayout from "../components/PageLayout";
import apiClient from "../config/api";

// ==========================================
// ICONS
// ==========================================

const ResumeIcon = ({ type, size = 20 }) => {
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
    upload: (
      <>
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M5 20h14" />
      </>
    ),

    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h6" />
      </>
    ),

    score: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 12l4-4" />
        <path d="M8 16a5.5 5.5 0 0 1 8-8" />
      </>
    ),

    words: (
      <>
        <path d="M4 6h16" />
        <path d="M4 12h12" />
        <path d="M4 18h8" />
      </>
    ),

    skills: (
      <>
        <path d="M4 19V9" />
        <path d="M10 19V5" />
        <path d="M16 19v-7" />
        <path d="M22 19V3" />
      </>
    ),

    ai: (
      <>
        <path d="M12 3v3" />
        <path d="M12 18v3" />
        <path d="M3 12h3" />
        <path d="M18 12h3" />
        <rect x="7" y="7" width="10" height="10" rx="3" />
        <circle cx="10" cy="11" r=".5" fill="currentColor" />
        <circle cx="14" cy="11" r=".5" fill="currentColor" />
        <path d="M10 14h4" />
      </>
    ),

    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),

    warning: (
      <>
        <path d="M10.3 3.7 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),

    bulb: (
      <>
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M8.5 14.5A6 6 0 1 1 15.5 14.5C14.5 15.3 14 16 14 18h-4c0-2-.5-2.7-1.5-3.5z" />
      </>
    ),

    history: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5" />
        <path d="M12 7v5l3 2" />
      </>
    ),

    close: (
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6 6 18" />
      </>
    ),

    arrow: (
      <path d="m9 18 6-6-6-6" />
    ),
  };

  return <svg {...common}>{icons[type]}</svg>;
};

// ==========================================
// STAT CARD
// ==========================================

function ResumeStatCard({
  icon,
  title,
  value,
  description,
}) {
  return (
    <div className="sb-card p-5">
      <div
        className="
          w-10
          h-10
          rounded-xl
          bg-[#e8f5f1]
          text-[#0f766e]
          flex
          items-center
          justify-center
          mb-5
        "
      >
        <ResumeIcon type={icon} />
      </div>

      <p
        className="
          m-0
          text-[14px]
          font-medium
          text-[#71817e]
        "
      >
        {title}
      </p>

      <h3
        className="
          m-0
          mt-1
          text-[27px]
          font-semibold
          tracking-[-0.5px]
          text-[#163b38]
        "
      >
        {value}
      </h3>

      <p
        className="
          m-0
          mt-1
          text-[13px]
          text-[#71817e]
        "
      >
        {description}
      </p>
    </div>
  );
}

// ==========================================
// SECTION HEADER
// ==========================================

function SectionHeader({
  icon,
  title,
  description,
  tone = "green",
}) {
  const tones = {
    green: "bg-[#e8f5f1] text-[#0f766e]",
    success: "bg-[#edf8ee] text-[#39894a]",
    warning: "bg-[#fff7e8] text-[#b67b16]",
    danger: "bg-[#fff1ef] text-[#c75a52]",
  };

  return (
    <div
      className="
        flex
        items-start
        gap-3
        mb-5
      "
    >
      <div
        className={`
          w-9
          h-9
          shrink-0
          rounded-xl
          flex
          items-center
          justify-center
          ${tones[tone]}
        `}
      >
        <ResumeIcon
          type={icon}
          size={18}
        />
      </div>

      <div>
        <h2
          className="
            m-0
            text-[17px]
            font-semibold
            text-[#163b38]
          "
        >
          {title}
        </h2>

        {description && (
          <p
            className="
              m-0
              mt-1
              text-[13px]
              text-[#71817e]
            "
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

// ==========================================
// RESUME ANALYZER
// ==========================================

function ResumeAnalyzer() {
  const [file, setFile] =
    useState(null);

  const [error, setError] =
    useState("");

  const [showToast, setShowToast] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [
    historyLoading,
    setHistoryLoading,
  ] = useState(true);

  const [analysis, setAnalysis] =
    useState(null);

  const [history, setHistory] =
    useState([]);

  // ==========================================
  // FETCH HISTORY
  // ==========================================

  const fetchResumeHistory =
    async () => {
      try {
        setHistoryLoading(true);

        const response =
          await apiClient.get(
            "/resume/history"
          );

        const previousHistory =
          response.data.history || [];

        setHistory(
          previousHistory
        );

        if (
          previousHistory.length > 0
        ) {
          setAnalysis(
            previousHistory[0]
          );
        }
      } catch (err) {
        console.error(
          "Failed to fetch resume history:",
          err
        );
      } finally {
        setHistoryLoading(false);
      }
    };

  useEffect(() => {
    fetchResumeHistory();
  }, []);

  // ==========================================
  // FILE UPLOAD + ANALYSIS
  // ==========================================

  const handleFileChange =
    async (e) => {
      const selected =
        e.target.files[0];

      if (!selected) return;

      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (
        !allowedTypes.includes(
          selected.type
        )
      ) {
        setError(
          "Only PDF or DOCX files are allowed"
        );

        setFile(null);
        return;
      }

      if (
        selected.size >
        5 * 1024 * 1024
      ) {
        setError(
          "File size must be less than 5 MB"
        );

        setFile(null);
        return;
      }

      try {
        setFile(selected);
        setError("");
        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "resume",
          selected
        );

        const response =
          await apiClient.post(
            "/resume/analyze",
            formData
          );

        setAnalysis(response.data);

        setHistory(
          (previousHistory) => {
            const newItem =
              response.data;

            const withoutDuplicate =
              previousHistory.filter(
                (item) =>
                  item.analysisId !==
                  newItem.analysisId
              );

            return [
              newItem,
              ...withoutDuplicate,
            ];
          }
        );

        setShowToast(true);

        setTimeout(() => {
          setShowToast(false);
        }, 2500);
      } catch (err) {
        console.error(
          "Resume Analysis Error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
            "Failed to analyze resume"
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================
  // REMOVE FILE
  // ==========================================

  const removeFile = () => {
    setFile(null);
    setError("");
    setShowToast(false);
  };

  // ==========================================
  // OPEN HISTORY
  // ==========================================

  const openHistoryAnalysis = (
    item
  ) => {
    setAnalysis(item);
    setFile(null);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // FORMAT FILE SIZE
  // ==========================================

  const formatFileSize = (
    bytes
  ) => {
    if (!bytes) return "";

    const mb =
      bytes / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }

    return `${(
      bytes / 1024
    ).toFixed(0)} KB`;
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <>
      <Toast
        message="Resume analyzed successfully"
        show={showToast}
      />

      <PageLayout
        title="Resume Analyzer"
        subtitle="Upload your resume and get structured AI-powered placement insights."
      >
        {/* ====================================
            UPLOAD SECTION
        ==================================== */}

        <section className="sb-card p-5 sm:p-6">
          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-5
              mb-5
            "
          >
            <div>
              <p
                className="
                  m-0
                  text-[13px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[#0f766e]
                "
              >
                Resume Analysis
              </p>

              <h2
                className="
                  m-0
                  mt-1
                  text-[18px]
                  font-semibold
                  text-[#163b38]
                "
              >
                Upload your latest resume
              </h2>

              <p
                className="
                  m-0
                  mt-1
                  text-[14px]
                  text-[#71817e]
                "
              >
                We support PDF and DOCX
                files up to 5 MB.
              </p>
            </div>

            <div
              className="
                inline-flex
                items-center
                gap-2
                self-start
                lg:self-auto

                px-3
                py-1.5

                rounded-full

                bg-[#f1f7f4]
                text-[#526562]

                text-[13px]
                font-medium
              "
            >
              <span
                className="
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-[#4caf50]
                "
              />

              PDF & DOCX supported
            </div>
          </div>

          {/* UPLOAD BOX */}

          <label
            className={`
              relative
              block

              border
              border-dashed

              rounded-2xl

              px-5
              py-9

              text-center

              transition-all
              duration-200

              ${
                loading
                  ? `
                    cursor-not-allowed
                    border-[#cfe2dc]
                    bg-[#f7fbf9]
                  `
                  : `
                    cursor-pointer
                    border-[#c9dbd5]
                    bg-[#fbfdfc]

                    hover:border-[#0f766e]
                    hover:bg-[#f5faf8]
                  `
              }
            `}
          >
            <div
              className="
                w-12
                h-12

                mx-auto
                mb-3

                rounded-2xl

                bg-[#e8f5f1]
                text-[#0f766e]

                flex
                items-center
                justify-center
              "
            >
              {loading ? (
                <div
                  className="
                    w-5
                    h-5
                    border-2
                    border-[#b9d7ce]
                    border-t-[#0f766e]
                    rounded-full
                    animate-spin
                  "
                />
              ) : (
                <ResumeIcon
                  type="upload"
                  size={21}
                />
              )}
            </div>

            <p
              className="
                m-0
                text-[14px]
                font-semibold
                text-[#405653]
              "
            >
              {loading
                ? "Analyzing your resume..."
                : "Choose a resume to analyze"}
            </p>

            <p
              className="
                m-0
                mt-1
                text-[13px]
                text-[#71817e]
              "
            >
              {loading
                ? "Please wait while SkillBridge processes your resume."
                : "Click to browse • PDF or DOCX • Maximum 5 MB"}
            </p>

            <input
              type="file"
              accept=".pdf,.docx"
              hidden
              disabled={loading}
              onChange={
                handleFileChange
              }
            />
          </label>

          {/* ERROR */}

          {error && (
            <div
              className="
                mt-4

                flex
                items-start
                gap-3

                p-3.5

                rounded-xl

                bg-[#fff3f1]
                border
                border-[#f2d3ce]

                text-[#b64f48]
              "
            >
              <div className="mt-[1px] shrink-0">
                <ResumeIcon
                  type="warning"
                  size={17}
                />
              </div>

              <p
                className="
                  m-0
                  text-[14px]
                  font-medium
                "
              >
                {error}
              </p>
            </div>
          )}

          {/* SELECTED FILE */}

          {file && (
            <div
              className="
                mt-4

                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between

                gap-4

                p-4

                rounded-xl

                bg-[#f8fbfa]
                border
                border-[#e2ebe7]
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                  min-w-0
                "
              >
                <div
                  className="
                    w-10
                    h-10
                    shrink-0

                    rounded-xl

                    bg-[#e8f5f1]
                    text-[#0f766e]

                    flex
                    items-center
                    justify-center
                  "
                >
                  <ResumeIcon
                    type="file"
                    size={18}
                  />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      m-0
                      text-[14px]
                      font-semibold
                      text-[#405653]
                      truncate
                    "
                    title={file.name}
                  >
                    {file.name}
                  </p>

                  <p
                    className="
                      m-0
                      mt-[2px]
                      text-[13px]
                      text-[#71817e]
                    "
                  >
                    {formatFileSize(
                      file.size
                    )}
                    {" • "}
                    {loading
                      ? "Analysis in progress"
                      : "Analysis completed"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={removeFile}
                disabled={loading}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2

                  px-3
                  py-2

                  rounded-lg

                  border
                  border-[#ecd4d0]

                  bg-white
                  text-[#b85a52]

                  text-[13px]
                  font-semibold

                  transition-all
                  duration-200

                  hover:bg-[#fff3f1]

                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                <ResumeIcon
                  type="close"
                  size={14}
                />

                Remove
              </button>
            </div>
          )}
        </section>

        {/* ====================================
            HISTORY LOADING
        ==================================== */}

        {historyLoading && (
          <div
            className="
              sb-card
              mt-5
              p-8
              flex
              items-center
              justify-center
              gap-3
            "
          >
            <div
              className="
                w-5
                h-5
                border-2
                border-[#cfe2dc]
                border-t-[#0f766e]
                rounded-full
                animate-spin
              "
            />

            <p
              className="
                m-0
                text-[14px]
                text-[#71817e]
              "
            >
              Loading your resume
              history...
            </p>
          </div>
        )}

        {/* ====================================
            RESULTS
        ==================================== */}

        {!loading &&
          !historyLoading &&
          analysis && (
            <>
              {/* ==============================
                  STATS
              ============================== */}

              <section
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-3
                  gap-4
                  mt-5
                "
              >
                <ResumeStatCard
                  icon="score"
                  title="ATS Compatibility"
                  value={`${
                    analysis.atsCompatibilityScore ??
                    0
                  }%`}
                  description="Internal compatibility estimate"
                />

                <ResumeStatCard
                  icon="words"
                  title="Resume Words"
                  value={
                    analysis
                      .resumeStats
                      ?.wordCount ?? 0
                  }
                  description="Total extracted words"
                />

                <ResumeStatCard
                  icon="skills"
                  title="Skills Detected"
                  value={
                    analysis
                      .resumeStats
                      ?.detectedSkills
                      ?.length ?? 0
                  }
                  description="Technical keywords found"
                />
              </section>

              {/* ==============================
                  AI SUMMARY
              ============================== */}

              <section className="sb-card p-5 sm:p-6 mt-5">
                <SectionHeader
                  icon="ai"
                  title="AI Resume Summary"
                  description="A quick overview of your current resume."
                />

                <div
                  className="
                    p-4

                    rounded-xl

                    bg-[#f8fbfa]
                    border
                    border-[#e7efec]
                  "
                >
                  <p
                    className="
                      m-0
                      text-[14px]
                      leading-6
                      text-[#526562]
                    "
                  >
                    {analysis.summary ||
                      "No summary available."}
                  </p>
                </div>
              </section>

              {/* ==============================
                  STRENGTHS + IMPROVEMENTS
              ============================== */}

              <section
                className="
                  grid
                  grid-cols-1
                  xl:grid-cols-2
                  items-start
                  gap-5
                  mt-5
                "
              >
                {/* STRENGTHS */}

                <div className="sb-card p-5 sm:p-6">
                  <SectionHeader
                    icon="check"
                    title="Strengths"
                    description="What your resume is already doing well."
                    tone="success"
                  />

                  {analysis.strengths
                    ?.length > 0 ? (
                    <div className="space-y-2.5">
                      {analysis.strengths.map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            key={index}
                            className="
                              flex
                              items-start
                              gap-3

                              p-3.5

                              rounded-xl

                              bg-[#f8fcf8]
                              border
                              border-[#e1eee2]
                            "
                          >
                            <div
                              className="
                                w-5
                                h-5
                                shrink-0
                                mt-[1px]

                                rounded-full

                                bg-[#e4f4e6]
                                text-[#39894a]

                                flex
                                items-center
                                justify-center
                              "
                            >
                              <ResumeIcon
                                type="check"
                                size={13}
                              />
                            </div>

                            <p
                              className="
                                m-0
                                text-[14px]
                                leading-5
                                text-[#526562]
                              "
                            >
                              {item}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p
                      className="
                        m-0
                        text-[14px]
                        text-[#71817e]
                      "
                    >
                      No strengths
                      detected.
                    </p>
                  )}
                </div>

                {/* IMPROVEMENTS */}

                <div className="sb-card p-5 sm:p-6">
                  <SectionHeader
                    icon="warning"
                    title="Areas to Improve"
                    description="Important areas that can make your resume stronger."
                    tone="warning"
                  />

                  {analysis.weaknesses
                    ?.length > 0 ? (
                    <div className="space-y-2.5">
                      {analysis.weaknesses.map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            key={index}
                            className="
                              flex
                              items-start
                              gap-3

                              p-3.5

                              rounded-xl

                              bg-[#fffaf2]
                              border
                              border-[#f0e5ce]
                            "
                          >
                            <div
                              className="
                                w-5
                                h-5
                                shrink-0
                                mt-[1px]

                                rounded-full

                                bg-[#fff0d3]
                                text-[#b67b16]

                                flex
                                items-center
                                justify-center
                              "
                            >
                              <span className="text-[13px] font-bold">
                                !
                              </span>
                            </div>

                            <p
                              className="
                                m-0
                                text-[14px]
                                leading-5
                                text-[#526562]
                              "
                            >
                              {item}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p
                      className="
                        m-0
                        text-[14px]
                        text-[#71817e]
                      "
                    >
                      No major areas
                      to improve
                      detected.
                    </p>
                  )}
                </div>
              </section>

              {/* ==============================
                  SKILLS + KEYWORDS
              ============================== */}

              <section
                className="
                  grid
                  grid-cols-1
                  xl:grid-cols-2
                  items-start
                  gap-5
                  mt-5
                "
              >
                {/* DETECTED SKILLS */}

                <div className="sb-card p-5 sm:p-6">
                  <SectionHeader
                    icon="skills"
                    title="Detected Technical Skills"
                    description="Skills identified from your resume."
                  />

                  {analysis.resumeStats
                    ?.detectedSkills
                    ?.length > 0 ? (
                    <div
                      className="
                        flex
                        flex-wrap
                        gap-2
                      "
                    >
                      {analysis.resumeStats.detectedSkills.map(
                        (
                          skill,
                          index
                        ) => (
                          <span
                            key={index}
                            className="
                              inline-flex
                              items-center

                              px-3
                              py-1.5

                              rounded-lg

                              bg-[#e8f5f1]
                              border
                              border-[#d4e9e2]

                              text-[13px]
                              font-semibold
                              text-[#0f766e]
                            "
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <p
                      className="
                        m-0
                        text-[14px]
                        text-[#71817e]
                      "
                    >
                      No supported
                      technical skills
                      detected.
                    </p>
                  )}
                </div>

                {/* KEYWORDS */}

                <div className="sb-card p-5 sm:p-6">
                  <SectionHeader
                    icon="bulb"
                    title="Suggested Keywords"
                    description="Relevant keywords you may consider adding."
                    tone="warning"
                  />

                  {analysis
                    .missingKeywords
                    ?.length > 0 ? (
                    <div
                      className="
                        flex
                        flex-wrap
                        gap-2
                      "
                    >
                      {analysis.missingKeywords.map(
                        (
                          keyword,
                          index
                        ) => (
                          <span
                            key={index}
                            className="
                              inline-flex
                              items-center

                              px-3
                              py-1.5

                              rounded-lg

                              bg-[#fff8e9]
                              border
                              border-[#f0e1be]

                              text-[13px]
                              font-semibold
                              text-[#9b6c1b]
                            "
                          >
                            {keyword}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <p
                      className="
                        m-0
                        text-[14px]
                        text-[#71817e]
                      "
                    >
                      No additional
                      keywords
                      suggested.
                    </p>
                  )}

                  <p
                    className="
                      m-0
                      mt-4

                      pt-3

                      border-t
                      border-[#edf2f0]

                      text-[12px]
                      leading-4
                      text-[#71817e]
                    "
                  >
                    Add a keyword only
                    when it truthfully
                    represents your
                    skills or experience.
                  </p>
                </div>
              </section>

              {/* ==============================
                  IMPROVEMENT SUGGESTIONS
              ============================== */}

              <section className="sb-card p-5 sm:p-6 mt-5">
                <SectionHeader
                  icon="bulb"
                  title="AI Improvement Suggestions"
                  description="Actionable changes to improve your resume."
                />

                {analysis.suggestions
                  ?.length > 0 ? (
                  <div
                    className="
                      grid
                      grid-cols-1
                      lg:grid-cols-2
                      gap-3
                    "
                  >
                    {analysis.suggestions.map(
                      (
                        suggestion,
                        index
                      ) => (
                        <div
                          key={index}
                          className="
                            flex
                            items-start
                            gap-3

                            p-4

                            rounded-xl

                            bg-[#f8fbfa]
                            border
                            border-[#e7efec]
                          "
                        >
                          <div
                            className="
                              w-7
                              h-7
                              shrink-0

                              rounded-lg

                              bg-[#e8f5f1]
                              text-[#0f766e]

                              flex
                              items-center
                              justify-center

                              text-[13px]
                              font-bold
                            "
                          >
                            {index + 1}
                          </div>

                          <p
                            className="
                              m-0
                              text-[14px]
                              leading-5
                              text-[#526562]
                            "
                          >
                            {suggestion}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p
                    className="
                      m-0
                      text-[14px]
                      text-[#71817e]
                    "
                  >
                    No suggestions
                    available.
                  </p>
                )}
              </section>
            </>
          )}

        {/* ====================================
            EMPTY STATE
        ==================================== */}

        {!loading &&
          !historyLoading &&
          !analysis &&
          history.length === 0 && (
            <section className="sb-card mt-5 p-8">
              <div
                className="
                  max-w-md
                  mx-auto
                  py-5
                  text-center
                "
              >
                <div
                  className="
                    w-12
                    h-12
                    mx-auto
                    mb-3

                    rounded-2xl

                    bg-[#e8f5f1]
                    text-[#0f766e]

                    flex
                    items-center
                    justify-center
                  "
                >
                  <ResumeIcon
                    type="score"
                    size={21}
                  />
                </div>

                <h3
                  className="
                    m-0
                    text-[16px]
                    font-semibold
                    text-[#405653]
                  "
                >
                  No resume analysis
                  yet
                </h3>

                <p
                  className="
                    m-0
                    mt-1
                    text-[14px]
                    text-[#71817e]
                  "
                >
                  Upload your resume
                  above to receive
                  your first analysis.
                </p>
              </div>
            </section>
          )}

        {/* ====================================
            HISTORY
        ==================================== */}

        {!historyLoading &&
          history.length > 0 && (
            <section className="sb-card p-5 sm:p-6 mt-5">
              <SectionHeader
                icon="history"
                title="Resume Analysis History"
                description="Open any previous analysis to review its results."
              />

              <div className="space-y-2.5">
                {history.map(
                  (item, index) => {
                    const isCurrent =
                      analysis
                        ?.analysisId &&
                      item.analysisId ===
                        analysis.analysisId;

                    return (
                      <button
                        type="button"
                        key={
                          item.analysisId ||
                          index
                        }
                        onClick={() =>
                          openHistoryAnalysis(
                            item
                          )
                        }
                        className={`
                          w-full

                          flex
                          flex-col
                          sm:flex-row
                          sm:items-center
                          sm:justify-between

                          gap-4

                          text-left

                          p-4

                          rounded-xl

                          border

                          transition-all
                          duration-200

                          ${
                            isCurrent
                              ? `
                                bg-[#f1f8f5]
                                border-[#cfe2dc]
                              `
                              : `
                                bg-[#fbfdfc]
                                border-[#e7efec]

                                hover:bg-[#f5f9f7]
                                hover:border-[#cfe2dc]
                              `
                          }
                        `}
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-3
                            min-w-0
                          "
                        >
                          <div
                            className={`
                              w-9
                              h-9
                              shrink-0

                              rounded-xl

                              flex
                              items-center
                              justify-center

                              ${
                                isCurrent
                                  ? "bg-[#dff1eb] text-[#0f766e]"
                                  : "bg-[#f0f5f3] text-[#71817e]"
                              }
                            `}
                          >
                            <ResumeIcon
                              type="file"
                              size={17}
                            />
                          </div>

                          <div className="min-w-0">
                            <div
                              className="
                                flex
                                items-center
                                gap-2
                              "
                            >
                              <p
                                className="
                                  m-0
                                  text-[14px]
                                  font-semibold
                                  text-[#405653]
                                  truncate
                                "
                              >
                                {item.fileName ||
                                  "Resume"}
                              </p>

                              {isCurrent && (
                                <span
                                  className="
                                    hidden
                                    sm:inline-flex

                                    px-2
                                    py-[2px]

                                    rounded-full

                                    bg-[#dff1eb]
                                    text-[#0f766e]

                                    text-[12px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                  "
                                >
                                  Viewing
                                </span>
                              )}
                            </div>

                            <p
                              className="
                                m-0
                                mt-[3px]
                                text-[12px]
                                text-[#71817e]
                              "
                            >
                              {item.analyzedAt
                                ? new Date(
                                    item.analyzedAt
                                  ).toLocaleString()
                                : "Analysis date unavailable"}
                            </p>
                          </div>
                        </div>

                        <div
                          className="
                            flex
                            items-center
                            gap-4
                            sm:ml-auto
                          "
                        >
                          <div className="sm:text-right">
                            <p
                              className="
                                m-0
                                text-[12px]
                                uppercase
                                tracking-wide
                                text-[#71817e]
                              "
                            >
                              ATS Score
                            </p>

                            <p
                              className="
                                m-0
                                mt-[2px]
                                text-[17px]
                                font-semibold
                                text-[#163b38]
                              "
                            >
                              {item.atsCompatibilityScore ??
                                0}
                              %
                            </p>
                          </div>

                          <span className="text-[#a4b1ae]">
                            <ResumeIcon
                              type="arrow"
                              size={15}
                            />
                          </span>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </section>
          )}
      </PageLayout>
    </>
  );
}

export default ResumeAnalyzer;