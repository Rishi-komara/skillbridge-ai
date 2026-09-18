import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import DashboardTopbar from "../components/DashboardTopbar";
import apiClient from "../config/api";

// ==========================================
// ICONS
// ==========================================

const DashboardIcon = ({ type, size = 20 }) => {
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
    resume: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h6" />
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

    roadmap: (
      <>
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="6" r="2" />
        <path d="M8 18h3a3 3 0 0 0 3-3v-6a3 3 0 0 1 3-3" />
      </>
    ),

    interview: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <circle cx="12" cy="9" r="2.5" />
        <path d="M8 17c.8-2 2.1-3 4-3s3.2 1 4 3" />
      </>
    ),

    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),

    arrow: <path d="m9 18 6-6-6-6" />,

    activity: <path d="M3 12h4l2-7 4 14 2-7h6" />,
  };

  return <svg {...common}>{icons[type]}</svg>;
};

// ==========================================
// METRIC CARD
// ==========================================

function MetricCard({
  title,
  value,
  description,
  icon,
  available = true,
  loading = false,
}) {
  return (
    <div className="sb-card p-5 min-h-[138px] flex flex-col justify-between">
      <div className="flex items-start justify-between gap-4">
        <div
          className="
            w-10 h-10
            rounded-xl
            bg-[#e8f5f1]
            text-[#0f766e]
            flex items-center justify-center
          "
        >
          <DashboardIcon type={icon} />
        </div>

        {available && !loading && (
          <span
            className="
              text-[11px]
              font-semibold
              text-[#0f766e]
              bg-[#edf8ee]
              px-2.5 py-1
              rounded-full
            "
          >
            Updated
          </span>
        )}
      </div>

      <div className="mt-5">
        <p className="m-0 text-[13px] font-medium text-[#71817e]">
          {title}
        </p>

        <div className="mt-1 flex items-end gap-1">
          <h3
            className="
              m-0
              text-[26px]
              font-semibold
              tracking-[-0.5px]
              text-[#163b38]
            "
          >
            {loading ? "—" : available ? value : "Not started"}
          </h3>
        </div>

        <p className="m-0 mt-1 text-[11px] text-[#91a09d]">
          {description}
        </p>
      </div>
    </div>
  );
}

// ==========================================
// PROGRESS ITEM
// ==========================================

function ProgressItem({
  title,
  subtitle,
  value,
  available,
  loading,
}) {
  const safeValue = Math.min(
    100,
    Math.max(0, Number(value) || 0)
  );

  return (
    <div>
      <div className="flex justify-between items-center gap-4 mb-2">
        <div>
          <p className="m-0 text-[13px] font-medium text-[#405653]">
            {title}
          </p>

          <p className="m-0 mt-[2px] text-[11px] text-[#91a09d]">
            {subtitle}
          </p>
        </div>

        <span className="text-[13px] font-semibold text-[#163b38]">
          {loading
            ? "—"
            : available
            ? `${safeValue}%`
            : "Not started"}
        </span>
      </div>

      <div className="h-2 bg-[#edf2f0] rounded-full overflow-hidden">
        <div
          className="
            h-full
            bg-[#0f766e]
            rounded-full
            transition-all
            duration-500
          "
          style={{
            width: available ? `${safeValue}%` : "0%",
          }}
        />
      </div>
    </div>
  );
}

// ==========================================
// DASHBOARD
// ==========================================

function Dashboard() {
  const [resumeScore, setResumeScore] = useState(0);
  const [skillCompletion, setSkillCompletion] = useState(0);
  const [roadmapProgress, setRoadmapProgress] = useState(0);
  const [interviewScore, setInterviewScore] = useState(0);

  const [resumeAnalyzed, setResumeAnalyzed] = useState(false);
  const [skillGapAnalyzed, setSkillGapAnalyzed] = useState(false);
  const [roadmapStarted, setRoadmapStarted] = useState(false);
  const [interviewCompleted, setInterviewCompleted] =
    useState(false);

  const [dashboardLoading, setDashboardLoading] =
    useState(true);

  // ==========================================
  // FETCH REAL DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardLoading(true);

        const [
          resumeResult,
          skillGapResult,
          roadmapResult,
          tasksResult,
          interviewResult,
        ] = await Promise.allSettled([
          apiClient.get("/resume/history"),
          apiClient.get("/skill-gap/history"),
          apiClient.get("/roadmap/history"),
          apiClient.get("/tasks"),
          apiClient.get("/mock-interview/history"),
        ]);

        // ======================================
        // RESUME
        // ======================================

        if (resumeResult.status === "fulfilled") {
          const resumeHistory =
            resumeResult.value.data?.history || [];

          if (resumeHistory.length > 0) {
            const latestResume = resumeHistory[0];

            setResumeScore(
              Number(
                latestResume.atsCompatibilityScore
              ) || 0
            );

            setResumeAnalyzed(true);
          } else {
            setResumeScore(0);
            setResumeAnalyzed(false);
          }
        } else {
          console.error(
            "Resume dashboard fetch error:",
            resumeResult.reason
          );
        }

        // ======================================
        // SKILL GAP
        // ======================================

        if (skillGapResult.status === "fulfilled") {
          const skillGapHistory =
            skillGapResult.value.data?.history || [];

          if (skillGapHistory.length > 0) {
            const latestSkillGap =
              skillGapHistory[0];

            setSkillCompletion(
              Number(
                latestSkillGap
                  .skillCompletionPercentage
              ) || 0
            );

            setSkillGapAnalyzed(true);
          } else {
            setSkillCompletion(0);
            setSkillGapAnalyzed(false);
          }
        } else {
          console.error(
            "Skill gap dashboard fetch error:",
            skillGapResult.reason
          );
        }

        // ======================================
        // ROADMAP
        // ======================================

        if (roadmapResult.status === "fulfilled") {
          const roadmapHistory =
            roadmapResult.value.data?.history || [];

          if (roadmapHistory.length > 0) {
            setRoadmapStarted(true);

            if (tasksResult.status === "fulfilled") {
              setRoadmapProgress(
                Number(
                  tasksResult.value.data
                    ?.progressPercentage
                ) || 0
              );
            } else {
              setRoadmapProgress(
                Number(
                  roadmapHistory[0]
                    ?.progressPercentage
                ) || 0
              );

              console.error(
                "Tasks dashboard fetch error:",
                tasksResult.reason
              );
            }
          } else {
            setRoadmapStarted(false);
            setRoadmapProgress(0);
          }
        } else {
          console.error(
            "Roadmap dashboard fetch error:",
            roadmapResult.reason
          );
        }

        // ======================================
        // MOCK INTERVIEW
        // ======================================

        if (interviewResult.status === "fulfilled") {
          const interviewHistory =
            interviewResult.value.data?.history || [];

          const latestCompletedInterview =
            interviewHistory.find(
              (interview) =>
                interview?.status === "completed"
            );

          if (latestCompletedInterview) {
            setInterviewScore(
              Number(
                latestCompletedInterview.overallScore
              ) || 0
            );

            setInterviewCompleted(true);
          } else {
            setInterviewScore(0);
            setInterviewCompleted(false);
          }
        } else {
          console.error(
            "Interview dashboard fetch error:",
            interviewResult.reason
          );
        }
      } catch (error) {
        console.error(
          "Dashboard data fetch error:",
          error
        );
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ==========================================
  // REAL RECENT ACTIVITY
  // ==========================================

  const activities = [];

  if (resumeAnalyzed) {
    activities.push({
      title: "Resume analysis completed",
      description: `Latest ATS score: ${resumeScore}%`,
      path: "/resume",
    });
  }

  if (skillGapAnalyzed) {
    activities.push({
      title: "Skill gap analysis completed",
      description: `${skillCompletion}% of target-role skills matched`,
      path: "/skill-gap",
    });
  }

  if (roadmapStarted) {
    activities.push({
      title: "Learning roadmap generated",
      description: `${roadmapProgress}% of roadmap tasks completed`,
      path: "/roadmap",
    });
  }

  if (interviewCompleted) {
    activities.push({
      title: "Mock interview completed",
      description: `Latest practice score: ${interviewScore}/100`,
      path: "/mock-interview",
    });
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-[#f4f8f6] flex">
      <Sidebar />

      <main className="flex-1 min-w-0 fade-page">
        <div
          className="
            w-full
            max-w-[1380px]
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            pt-20
            lg:pt-6
            pb-12
          "
        >
          <DashboardTopbar />

          {/* ==================================
              PAGE INTRODUCTION
          ================================== */}

          <section
            className="
              flex
              flex-col
              md:flex-row
              md:items-end
              md:justify-between
              gap-4
              mb-6
            "
          >
            <div>
              <p
                className="
                  m-0
                  text-[12px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[#0f766e]
                "
              >
                Overview
              </p>

              <h1
                className="
                  m-0
                  mt-1
                  text-[28px]
                  md:text-[30px]
                  font-semibold
                  tracking-[-0.7px]
                  text-[#163b38]
                "
              >
                Placement Readiness
              </h1>

              <p className="m-0 mt-2 text-[14px] text-[#71817e]">
                Track your preparation and continue from
                where you left off.
              </p>
            </div>
          </section>

          {/* ==================================
              METRIC CARDS
          ================================== */}

          <section
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-4
              gap-4
            "
          >
            <MetricCard
              title="Resume Score"
              value={`${resumeScore}%`}
              description={
                resumeAnalyzed
                  ? "Latest ATS compatibility score"
                  : "Analyze your resume to get started"
              }
              icon="resume"
              available={resumeAnalyzed}
              loading={dashboardLoading}
            />

            <MetricCard
              title="Skill Completion"
              value={`${skillCompletion}%`}
              description={
                skillGapAnalyzed
                  ? "Based on your latest target role"
                  : "Complete a skill gap analysis"
              }
              icon="skills"
              available={skillGapAnalyzed}
              loading={dashboardLoading}
            />

            <MetricCard
              title="Roadmap Progress"
              value={`${roadmapProgress}%`}
              description={
                roadmapStarted
                  ? "Latest learning roadmap progress"
                  : "Generate your learning roadmap"
              }
              icon="roadmap"
              available={roadmapStarted}
              loading={dashboardLoading}
            />

            <MetricCard
              title="Mock Interview Score"
              value={`${interviewScore}/100`}
              description={
                interviewCompleted
                  ? "Latest completed AI practice interview"
                  : "Complete a mock interview to get a score"
              }
              icon="interview"
              available={interviewCompleted}
              loading={dashboardLoading}
            />
          </section>

          {/* ==================================
              MAIN GRID
          ================================== */}

          <section
            className="
              grid
              grid-cols-1
              xl:grid-cols-[1.3fr_0.9fr]
              items-start
              gap-5
              mt-5
            "
          >
            {/* ==================================
                PREPARATION PROGRESS
            ================================== */}

            <div className="sb-card p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="m-0 text-[17px] font-semibold text-[#163b38]">
                    Preparation Progress
                  </h2>

                  <p className="m-0 mt-1 text-[12px] text-[#91a09d]">
                    Progress from your completed
                    preparation modules
                  </p>
                </div>

                <div
                  className="
                    w-9 h-9
                    rounded-xl
                    bg-[#f1f7f4]
                    text-[#0f766e]
                    flex items-center justify-center
                  "
                >
                  <DashboardIcon
                    type="activity"
                    size={18}
                  />
                </div>
              </div>

              <div className="space-y-5">
                <ProgressItem
                  title="Resume Readiness"
                  subtitle="ATS compatibility"
                  value={resumeScore}
                  available={resumeAnalyzed}
                  loading={dashboardLoading}
                />

                <ProgressItem
                  title="Target Role Skills"
                  subtitle="Required skills matched"
                  value={skillCompletion}
                  available={skillGapAnalyzed}
                  loading={dashboardLoading}
                />

                <ProgressItem
                  title="Learning Roadmap"
                  subtitle="Roadmap tasks completed"
                  value={roadmapProgress}
                  available={roadmapStarted}
                  loading={dashboardLoading}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mt-6">
                <Link
                  to="/resume"
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    px-4 py-3.5
                    rounded-xl
                    border
                    border-[#e2ebe7]
                    bg-[#fbfdfc]
                    transition-all
                    duration-200
                    hover:bg-[#f1f7f4]
                    hover:border-[#cfe2dc]
                  "
                >
                  <div>
                    <p className="m-0 text-[13px] font-semibold text-[#163b38]">
                      Resume Analyzer
                    </p>

                    <p className="m-0 mt-1 text-[11px] text-[#91a09d]">
                      Review your resume
                    </p>
                  </div>

                  <span className="text-[#0f766e]">
                    <DashboardIcon
                      type="arrow"
                      size={16}
                    />
                  </span>
                </Link>

                <Link
                  to="/skill-gap"
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    px-4 py-3.5
                    rounded-xl
                    border
                    border-[#e2ebe7]
                    bg-[#fbfdfc]
                    transition-all
                    duration-200
                    hover:bg-[#f1f7f4]
                    hover:border-[#cfe2dc]
                  "
                >
                  <div>
                    <p className="m-0 text-[13px] font-semibold text-[#163b38]">
                      Skill Gap
                    </p>

                    <p className="m-0 mt-1 text-[11px] text-[#91a09d]">
                      Check role readiness
                    </p>
                  </div>

                  <span className="text-[#0f766e]">
                    <DashboardIcon
                      type="arrow"
                      size={16}
                    />
                  </span>
                </Link>
              </div>
            </div>

            {/* ==================================
                CONTINUE PREPARATION
            ================================== */}

            <div className="sb-card p-6">
              <div className="mb-6">
                <h2 className="m-0 text-[17px] font-semibold text-[#163b38]">
                  Continue Preparation
                </h2>

                <p className="m-0 mt-1 text-[12px] text-[#91a09d]">
                  Continue with each SkillBridge module
                </p>
              </div>

              <div className="space-y-3">
                {/* RESUME */}

                <PreparationLink
                  to="/resume"
                  icon="resume"
                  title={
                    resumeAnalyzed
                      ? "Review resume feedback"
                      : "Analyze your resume"
                  }
                  description={
                    resumeAnalyzed
                      ? `${resumeScore}% current score`
                      : "Get ATS feedback"
                  }
                />

                {/* SKILL GAP */}

                <PreparationLink
                  to="/skill-gap"
                  icon="skills"
                  title={
                    skillGapAnalyzed
                      ? "Review missing skills"
                      : "Find your skill gap"
                  }
                  description={
                    skillGapAnalyzed
                      ? `${skillCompletion}% skills matched`
                      : "Select a target role"
                  }
                />

                {/* ROADMAP */}

                <PreparationLink
                  to="/roadmap"
                  icon="roadmap"
                  title={
                    roadmapStarted
                      ? "Continue learning roadmap"
                      : "Generate learning roadmap"
                  }
                  description={
                    roadmapStarted
                      ? `${roadmapProgress}% completed`
                      : "Build your preparation plan"
                  }
                />

                {/* MOCK INTERVIEW */}

                <PreparationLink
                  to="/mock-interview"
                  icon="interview"
                  title={
                    interviewCompleted
                      ? "Practice another interview"
                      : "Start mock interview"
                  }
                  description={
                    interviewCompleted
                      ? `Latest score: ${interviewScore}/100`
                      : "Practice interview questions"
                  }
                />
              </div>
            </div>
          </section>

          {/* ==================================
              RECENT ACTIVITY
          ================================== */}

          <section className="sb-card p-6 mt-5">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="m-0 text-[17px] font-semibold text-[#163b38]">
                  Recent Activity
                </h2>

                <p className="m-0 mt-1 text-[12px] text-[#91a09d]">
                  Your current SkillBridge activity
                </p>
              </div>
            </div>

            {dashboardLoading ? (
              <div className="py-8 text-center text-[13px] text-[#91a09d]">
                Loading your activity...
              </div>
            ) : activities.length > 0 ? (
              <div className="divide-y divide-[#edf2f0]">
                {activities.map(
                  (activity, index) => (
                    <Link
                      key={`${activity.title}-${index}`}
                      to={activity.path}
                      className="
                        flex
                        items-center
                        gap-4
                        py-4
                        group
                      "
                    >
                      <div
                        className="
                          w-9 h-9
                          shrink-0
                          rounded-full
                          bg-[#edf8ee]
                          text-[#39894a]
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <DashboardIcon
                          type="check"
                          size={17}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="m-0 text-[13px] font-semibold text-[#405653]">
                          {activity.title}
                        </p>

                        <p className="m-0 mt-[2px] text-[11px] text-[#91a09d]">
                          {activity.description}
                        </p>
                      </div>

                      <span
                        className="
                          text-[#a4b1ae]
                          group-hover:text-[#0f766e]
                          transition-colors
                        "
                      >
                        <DashboardIcon
                          type="arrow"
                          size={15}
                        />
                      </span>
                    </Link>
                  )
                )}
              </div>
            ) : (
              <div className="py-10 flex flex-col items-center text-center">
                <div
                  className="
                    w-11 h-11
                    rounded-xl
                    bg-[#f1f7f4]
                    text-[#0f766e]
                    flex
                    items-center
                    justify-center
                    mb-3
                  "
                >
                  <DashboardIcon
                    type="activity"
                    size={19}
                  />
                </div>

                <p className="m-0 text-[13px] font-semibold text-[#526562]">
                  No activity yet
                </p>

                <p className="m-0 mt-1 text-[12px] text-[#91a09d]">
                  Analyze your resume to begin tracking
                  your preparation.
                </p>

                <Link
                  to="/resume"
                  className="sb-btn-primary mt-4 text-[13px]"
                >
                  Analyze Resume
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// CONTINUE PREPARATION LINK
// ==========================================

function PreparationLink({
  to,
  icon,
  title,
  description,
}) {
  return (
    <Link
      to={to}
      className="
        group
        flex
        items-center
        gap-3
        p-3
        rounded-xl
        transition-colors
        duration-200
        hover:bg-[#f5f9f7]
      "
    >
      <div
        className="
          w-9 h-9
          shrink-0
          rounded-lg
          bg-[#e8f5f1]
          text-[#0f766e]
          flex
          items-center
          justify-center
        "
      >
        <DashboardIcon
          type={icon}
          size={17}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="m-0 text-[13px] font-semibold text-[#405653]">
          {title}
        </p>

        <p className="m-0 mt-[2px] text-[11px] text-[#91a09d]">
          {description}
        </p>
      </div>

      <span
        className="
          text-[#a4b1ae]
          group-hover:text-[#0f766e]
          transition-colors
        "
      >
        <DashboardIcon
          type="arrow"
          size={15}
        />
      </span>
    </Link>
  );
}

export default Dashboard;