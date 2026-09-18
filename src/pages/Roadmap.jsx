import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import apiClient from "../config/api";

// ==========================================
// ICONS
// ==========================================

const RoadmapIcon = ({ type, size = 20 }) => {
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
    route: (
      <>
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="6" r="2" />
        <path d="M8 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3h1" />
      </>
    ),

    sparkle: (
      <>
        <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3z" />
        <path d="m18 14 .8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14z" />
      </>
    ),

    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" />
      </>
    ),

    layers: (
      <>
        <path d="m12 3-9 5 9 5 9-5-9-5z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 16 9 5 9-5" />
      </>
    ),

    tasks: (
      <>
        <path d="m4 7 2 2 3-3" />
        <path d="M11 8h9" />
        <path d="m4 15 2 2 3-3" />
        <path d="M11 16h9" />
      </>
    ),

    chart: (
      <>
        <path d="M4 19V9" />
        <path d="M10 19V5" />
        <path d="M16 19v-7" />
        <path d="M22 19V3" />
      </>
    ),

    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),

    book: (
      <>
        <path d="M4 5a3 3 0 0 1 3-3h5v17H7a3 3 0 0 0-3 3V5z" />
        <path d="M20 5a3 3 0 0 0-3-3h-5v17h5a3 3 0 0 1 3 3V5z" />
      </>
    ),

    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),

    trophy: (
      <>
        <path d="M8 4h8v4a4 4 0 0 1-8 0V4z" />
        <path d="M8 6H4v1a4 4 0 0 0 4 4" />
        <path d="M16 6h4v1a4 4 0 0 1-4 4" />
        <path d="M12 12v5" />
        <path d="M9 21h6" />
        <path d="M10 17h4" />
      </>
    ),

    history: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5" />
        <path d="M12 7v5l3 2" />
      </>
    ),

    warning: (
      <>
        <path d="M10.3 3.7 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),

    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5" />
        <path d="M12 8h.01" />
      </>
    ),

    arrow: <path d="m9 18 6-6-6-6" />,
  };

  return <svg {...common}>{icons[type]}</svg>;
};

// ==========================================
// METRIC CARD
// ==========================================

function MetricCard({
  icon,
  title,
  value,
  description,
  tone = "green",
}) {
  const tones = {
    green: "bg-[#e8f5f1] text-[#0f766e]",
    success: "bg-[#edf8ee] text-[#39894a]",
    warning: "bg-[#fff7e8] text-[#b67b16]",
    blue: "bg-[#edf5f8] text-[#477888]",
  };

  return (
    <div className="sb-card p-5">
      <div
        className={`
          w-10 h-10 rounded-xl
          flex items-center justify-center
          mb-5
          ${tones[tone]}
        `}
      >
        <RoadmapIcon type={icon} />
      </div>

      <p className="m-0 text-[14px] font-medium text-[#71817e]">
        {title}
      </p>

      <h3
        className="
          m-0 mt-1
          text-[24px]
          font-semibold
          tracking-[-0.4px]
          text-[#163b38]
        "
      >
        {value}
      </h3>

      <p className="m-0 mt-1 text-[14px] text-[#91a09d]">
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
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div
        className="
          w-9 h-9 shrink-0
          rounded-xl
          bg-[#e8f5f1]
          text-[#0f766e]
          flex items-center justify-center
        "
      >
        <RoadmapIcon type={icon} size={18} />
      </div>

      <div>
        <h2 className="m-0 text-[17px] font-semibold text-[#163b38]">
          {title}
        </h2>

        {description && (
          <p className="m-0 mt-1 text-[14px] text-[#91a09d]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

// ==========================================
// ROADMAP
// ==========================================

function Roadmap() {
  const [roadmap, setRoadmap] =
    useState(null);

  const [history, setHistory] =
    useState([]);

  const [tasks, setTasks] =
    useState([]);

  const [taskProgress, setTaskProgress] =
    useState(0);

  const [completedTasks, setCompletedTasks] =
    useState(0);

  const [totalTasks, setTotalTasks] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [updatingTask, setUpdatingTask] =
    useState("");

  const [error, setError] =
    useState("");

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        historyResponse,
        tasksResponse,
      ] = await Promise.all([
        apiClient.get(
          "/roadmap/history"
        ),
        apiClient.get("/tasks"),
      ]);

      const roadmapHistory =
        historyResponse.data.history ||
        [];

      setHistory(roadmapHistory);

      if (
        roadmapHistory.length > 0
      ) {
        setRoadmap(
          roadmapHistory[0]
        );
      }

      const taskData =
        tasksResponse.data;

      setTasks(
        taskData.tasks || []
      );

      setTaskProgress(
        taskData.progressPercentage ||
          0
      );

      setCompletedTasks(
        taskData.completedTasks || 0
      );

      setTotalTasks(
        taskData.totalTasks || 0
      );
    } catch (err) {
      console.error(
        "Roadmap load error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load roadmap"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD TASKS
  // ==========================================

  const loadTasks = async () => {
    try {
      const response =
        await apiClient.get("/tasks");

      setTasks(
        response.data.tasks || []
      );

      setTaskProgress(
        response.data
          .progressPercentage || 0
      );

      setCompletedTasks(
        response.data
          .completedTasks || 0
      );

      setTotalTasks(
        response.data.totalTasks || 0
      );

      setRoadmap((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          progressPercentage:
            response.data
              .progressPercentage || 0,
        };
      });
    } catch (err) {
      console.error(
        "Load tasks error:",
        err
      );
    }
  };

  // ==========================================
  // GENERATE ROADMAP
  // ==========================================

  const handleGenerateRoadmap =
    async () => {
      try {
        setGenerating(true);
        setError("");

        const response =
          await apiClient.post(
            "/roadmap/generate"
          );

        const newRoadmap =
          response.data;

        setRoadmap(newRoadmap);

        // Prevent the same roadmap from
        // appearing twice in local history.
        setHistory(
          (previous) => [
            newRoadmap,
            ...previous.filter(
              (item) =>
                item.roadmapId !==
                newRoadmap.roadmapId
            ),
          ]
        );

        await loadTasks();
      } catch (err) {
        console.error(
          "Generate roadmap error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
            "Failed to generate roadmap"
        );
      } finally {
        setGenerating(false);
      }
    };

  // ==========================================
  // UPDATE TASK
  // ==========================================

  const handleTaskToggle =
    async (task) => {
      if (!roadmap?.roadmapId) {
        setError(
          "Roadmap information is missing."
        );
        return;
      }

      const latestRoadmapId =
        history[0]?.roadmapId;

      if (
        latestRoadmapId &&
        roadmap.roadmapId !==
          latestRoadmapId
      ) {
        setError(
          "Task progress can only be updated for your latest roadmap."
        );
        return;
      }

      const newDoneValue =
        !task.done;

      try {
        setUpdatingTask(
          task.taskId
        );

        setError("");

        const response =
          await apiClient.patch(
            "/tasks/status",
            {
              roadmapId:
                roadmap.roadmapId,

              taskId:
                task.taskId,

              done: newDoneValue,
            }
          );

        setTasks(
          (previousTasks) =>
            previousTasks.map(
              (currentTask) =>
                currentTask.taskId ===
                task.taskId
                  ? {
                      ...currentTask,
                      done: newDoneValue,
                    }
                  : currentTask
            )
        );

        const newProgress =
          response.data
            .progressPercentage || 0;

        setTaskProgress(
          newProgress
        );

        setCompletedTasks(
          response.data
            .completedTasks || 0
        );

        setTotalTasks(
          response.data
            .totalTasks || 0
        );

        setRoadmap(
          (previous) => ({
            ...previous,
            progressPercentage:
              newProgress,
          })
        );

        setHistory(
          (previousHistory) =>
            previousHistory.map(
              (item) =>
                item.roadmapId ===
                roadmap.roadmapId
                  ? {
                      ...item,
                      progressPercentage:
                        newProgress,
                    }
                  : item
            )
        );
      } catch (err) {
        console.error(
          "Task update error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
            "Failed to update task"
        );
      } finally {
        setUpdatingTask("");
      }
    };

  // ==========================================
  // FIND TASK
  // ==========================================

  const getTaskForPhase = (
    phaseIndex,
    taskIndex
  ) => {
    const taskId = `p${
      phaseIndex + 1
    }-t${taskIndex + 1}`;

    return tasks.find(
      (task) =>
        task.taskId === taskId
    );
  };

  // ==========================================
  // HISTORY SELECT
  // ==========================================

  const handleHistorySelect = (
    oldRoadmap
  ) => {
    setRoadmap(oldRoadmap);
    setError("");

    if (
      oldRoadmap.roadmapId !==
      history[0]?.roadmapId
    ) {
      setTasks([]);

      setTaskProgress(
        oldRoadmap.progressPercentage ||
          0
      );
    } else {
      loadTasks();
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // HELPERS
  // ==========================================

  const isLatestRoadmap =
    roadmap?.roadmapId &&
    roadmap.roadmapId ===
      history[0]?.roadmapId;

  const displayedProgress =
    isLatestRoadmap
      ? taskProgress
      : roadmap?.progressPercentage ||
        0;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <PageLayout
        title="AI Roadmap"
        subtitle="Your personalized placement learning roadmap."
      >
        <section className="sb-card p-8">
          <div
            className="
              flex
              items-center
              justify-center
              gap-3
              min-h-[120px]
            "
          >
            <div
              className="
                w-5 h-5
                rounded-full
                border-2
                border-[#cfe2dc]
                border-t-[#0f766e]
                animate-spin
              "
            />

            <p className="m-0 text-[14px] text-[#71817e]">
              Loading your roadmap...
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
      title="AI Roadmap"
      subtitle="Follow a personalized learning plan built from your latest skill gap analysis."
    >
      {/* ====================================
          GENERATE SECTION
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
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
                w-10 h-10
                shrink-0
                rounded-xl
                bg-[#e8f5f1]
                text-[#0f766e]
                flex items-center
                justify-center
              "
            >
              <RoadmapIcon
                type="sparkle"
                size={19}
              />
            </div>

            <div>
              <p
                className="
                  m-0
                  text-[14px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[#0f766e]
                "
              >
                Personalized Plan
              </p>

              <h2
                className="
                  m-0 mt-1
                  text-[18px]
                  font-semibold
                  text-[#163b38]
                "
              >
                Build your learning roadmap
              </h2>

              <p
                className="
                  m-0 mt-1
                  text-[14px]
                  text-[#71817e]
                "
              >
                Generated using your latest
                Skill Gap Analysis.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={
              handleGenerateRoadmap
            }
            disabled={generating}
            className="
              sb-btn-primary
              self-start
              lg:self-auto
              min-h-[44px]
              px-5
              text-[14px]
            "
          >
            {generating ? (
              <>
                <span
                  className="
                    w-4 h-4
                    rounded-full
                    border-2
                    border-white/40
                    border-t-white
                    animate-spin
                  "
                />

                Generating...
              </>
            ) : (
              <>
                <RoadmapIcon
                  type="sparkle"
                  size={16}
                />

                {roadmap
                  ? "Generate New Roadmap"
                  : "Generate Roadmap"}
              </>
            )}
          </button>
        </div>

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
              <RoadmapIcon
                type="warning"
                size={17}
              />
            </div>

            <p className="m-0 text-[14px] font-medium">
              {error}
            </p>
          </div>
        )}
      </section>

      {/* ====================================
          NO ROADMAP
      ==================================== */}

      {!roadmap && (
        <section className="sb-card mt-5 p-8">
          <div
            className="
              max-w-md
              mx-auto
              py-7
              text-center
            "
          >
            <div
              className="
                w-12 h-12
                mx-auto mb-3
                rounded-2xl
                bg-[#e8f5f1]
                text-[#0f766e]
                flex items-center
                justify-center
              "
            >
              <RoadmapIcon
                type="route"
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
              No roadmap yet
            </h3>

            <p
              className="
                m-0 mt-1
                text-[14px]
                leading-5
                text-[#91a09d]
              "
            >
              Complete your Skill Gap
              Analysis and generate a
              personalized learning
              roadmap.
            </p>
          </div>
        </section>
      )}

      {/* ====================================
          ROADMAP
      ==================================== */}

      {roadmap && (
        <>
          {/* ==================================
              OVERVIEW
          ================================== */}

          <section className="sb-card p-5 sm:p-6 mt-5">
            <div
              className="
                flex
                flex-col
                lg:flex-row
                lg:items-start
                lg:justify-between
                gap-5
              "
            >
              <div className="max-w-3xl">
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    mb-2
                  "
                >
                  <span
                    className="
                      w-1.5 h-1.5
                      rounded-full
                      bg-[#4caf50]
                    "
                  />

                  <p
                    className="
                      m-0
                      text-[12px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-[#0f766e]
                    "
                  >
                    Target Role
                  </p>
                </div>

                <h2
                  className="
                    m-0
                    text-[22px]
                    sm:text-[24px]
                    font-semibold
                    tracking-[-0.4px]
                    text-[#163b38]
                  "
                >
                  {roadmap.title}
                </h2>

                <p
                  className="
                    m-0 mt-2
                    text-[14px]
                    sm:text-[14px]
                    leading-6
                    text-[#71817e]
                  "
                >
                  {roadmap.overview}
                </p>
              </div>

              <div
                className="
                  shrink-0
                  min-w-[180px]
                  p-4
                  rounded-xl
                  bg-[#f3f8f6]
                  border
                  border-[#e1ebe7]
                "
              >
                <div className="flex items-center gap-2 text-[#0f766e]">
                  <RoadmapIcon
                    type="clock"
                    size={16}
                  />

                  <p
                    className="
                      m-0
                      text-[12px]
                      font-semibold
                      uppercase
                      tracking-wide
                    "
                  >
                    Duration
                  </p>
                </div>

                <p
                  className="
                    m-0 mt-2
                    text-[16px]
                    font-semibold
                    text-[#405653]
                  "
                >
                  {roadmap.estimatedDuration ||
                    "Not specified"}
                </p>
              </div>
            </div>

            {/* PROGRESS */}

            <div
              className="
                mt-6
                pt-5
                border-t
                border-[#edf2f0]
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  mb-2
                "
              >
                <p
                  className="
                    m-0
                    text-[14px]
                    font-medium
                    text-[#71817e]
                  "
                >
                  Learning Progress
                </p>

                <p
                  className="
                    m-0
                    text-[14px]
                    font-semibold
                    text-[#0f766e]
                  "
                >
                  {displayedProgress}%
                </p>
              </div>

              <div
                className="
                  h-2.5
                  bg-[#edf2f0]
                  rounded-full
                  overflow-hidden
                "
              >
                <div
                  className="
                    h-full
                    bg-[#0f766e]
                    rounded-full
                    transition-all
                    duration-500
                  "
                  style={{
                    width: `${displayedProgress}%`,
                  }}
                />
              </div>
            </div>
          </section>

          {/* ==================================
              METRICS
          ================================== */}

          <section
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-4
              gap-4
              mt-5
            "
          >
            <MetricCard
              icon="target"
              title="Target Role"
              value={
                roadmap.role ||
                "Not specified"
              }
              description="Selected career direction"
            />

            <MetricCard
              icon="layers"
              title="Total Phases"
              value={
                roadmap.totalPhases ??
                roadmap.phases?.length ??
                0
              }
              description="Learning stages in this plan"
              tone="blue"
            />

            <MetricCard
              icon="tasks"
              title="Tasks Completed"
              value={
                isLatestRoadmap
                  ? `${completedTasks}/${totalTasks}`
                  : "View only"
              }
              description={
                isLatestRoadmap
                  ? "Practice tasks completed"
                  : "Historical roadmap"
              }
              tone="success"
            />

            <MetricCard
              icon="chart"
              title="Progress"
              value={`${displayedProgress}%`}
              description="Overall roadmap completion"
              tone="warning"
            />
          </section>

          {/* ==================================
              OLD ROADMAP NOTICE
          ================================== */}

          {!isLatestRoadmap && (
            <div
              className="
                mt-5
                flex
                items-start
                gap-3
                p-4
                rounded-xl
                bg-[#fff9ed]
                border
                border-[#f0e2c4]
                text-[#94691f]
              "
            >
              <div className="mt-[1px] shrink-0">
                <RoadmapIcon
                  type="info"
                  size={17}
                />
              </div>

              <div>
                <p className="m-0 text-[14px] font-semibold">
                  Historical roadmap
                </p>

                <p
                  className="
                    m-0 mt-1
                    text-[14px]
                    leading-5
                  "
                >
                  You are viewing an older
                  roadmap. Task completion can
                  only be updated on your latest
                  roadmap.
                </p>
              </div>
            </div>
          )}

          {/* ==================================
              PHASES
          ================================== */}

          <section className="mt-5">
            <SectionHeader
              icon="route"
              title="Learning Phases"
              description="Complete each phase step by step and track practice tasks."
            />

            <div className="space-y-4">
              {roadmap.phases?.map(
                (
                  phase,
                  phaseIndex
                ) => {
                  const phaseNumber =
                    phase.phase ||
                    phaseIndex + 1;

                  return (
                    <article
                      key={`${phase.skill}-${phaseIndex}`}
                      className="sb-card p-5 sm:p-6"
                    >
                      {/* PHASE HEADER */}

                      <div
                        className="
                          flex
                          flex-col
                          md:flex-row
                          md:items-center
                          md:justify-between
                          gap-4
                          pb-5
                          border-b
                          border-[#edf2f0]
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >
                          <div
                            className="
                              w-10 h-10
                              shrink-0
                              rounded-xl
                              bg-[#0f766e]
                              text-white
                              flex
                              items-center
                              justify-center
                              text-[14px]
                              font-bold
                            "
                          >
                            {phaseNumber}
                          </div>

                          <div>
                            <p
                              className="
                                m-0
                                text-[12px]
                                font-semibold
                                uppercase
                                tracking-wide
                                text-[#91a09d]
                              "
                            >
                              Phase {phaseNumber}
                            </p>

                            <h3
                              className="
                                m-0 mt-[2px]
                                text-[17px]
                                font-semibold
                                text-[#163b38]
                              "
                            >
                              {phase.skill}
                            </h3>
                          </div>
                        </div>

                        <div
                          className="
                            inline-flex
                            self-start
                            md:self-auto
                            items-center
                            gap-2
                            px-3
                            py-1.5
                            rounded-lg
                            bg-[#f1f6f4]
                            text-[#526562]
                            text-[12px]
                            font-semibold
                          "
                        >
                          <RoadmapIcon
                            type="clock"
                            size={14}
                          />

                          {phase.duration ||
                            "Flexible"}
                        </div>
                      </div>

                      {/* CONTENT */}

                      <div
                        className="
                          grid
                          grid-cols-1
                          lg:grid-cols-2
                          items-start
                          gap-5
                          mt-5
                        "
                      >
                        {/* TOPICS */}

                        <div>
                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              mb-3
                            "
                          >
                            <span className="text-[#0f766e]">
                              <RoadmapIcon
                                type="book"
                                size={16}
                              />
                            </span>

                            <h4
                              className="
                                m-0
                                text-[14px]
                                font-semibold
                                text-[#405653]
                              "
                            >
                              Topics to Learn
                            </h4>
                          </div>

                          <div className="space-y-2">
                            {phase.topics?.map(
                              (
                                topic,
                                topicIndex
                              ) => (
                                <div
                                  key={
                                    topicIndex
                                  }
                                  className="
                                    flex
                                    items-start
                                    gap-2.5
                                    p-3
                                    rounded-xl
                                    bg-[#f8fbfa]
                                    border
                                    border-[#e7efec]
                                  "
                                >
                                  <span
                                    className="
                                      w-1.5
                                      h-1.5
                                      mt-[7px]
                                      shrink-0
                                      rounded-full
                                      bg-[#0f766e]
                                    "
                                  />

                                  <p
                                    className="
                                      m-0
                                      text-[14px]
                                      leading-5
                                      text-[#526562]
                                    "
                                  >
                                    {typeof topic ===
                                    "string"
                                      ? topic
                                      : topic.title ||
                                        String(
                                          topic
                                        )}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* PRACTICE TASKS */}

                        <div>
                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              mb-3
                            "
                          >
                            <span className="text-[#39894a]">
                              <RoadmapIcon
                                type="tasks"
                                size={16}
                              />
                            </span>

                            <h4
                              className="
                                m-0
                                text-[14px]
                                font-semibold
                                text-[#405653]
                              "
                            >
                              Practice Tasks
                            </h4>
                          </div>

                          <div className="space-y-2">
                            {phase.tasks?.map(
                              (
                                taskTitle,
                                taskIndex
                              ) => {
                                const savedTask =
                                  getTaskForPhase(
                                    phaseIndex,
                                    taskIndex
                                  );

                                const taskId = `p${
                                  phaseIndex +
                                  1
                                }-t${
                                  taskIndex +
                                  1
                                }`;

                                const isDone =
                                  savedTask?.done ||
                                  false;

                                const isUpdating =
                                  updatingTask ===
                                  taskId;

                                const displayTitle =
                                  typeof taskTitle ===
                                  "string"
                                    ? taskTitle
                                    : taskTitle
                                        ?.title ||
                                      "Practice task";

                                return (
                                  <label
                                    key={taskId}
                                    className={`
                                      flex
                                      items-start
                                      gap-3
                                      p-3
                                      rounded-xl
                                      border
                                      transition-all
                                      duration-200

                                      ${
                                        isDone
                                          ? `
                                            bg-[#f3faf4]
                                            border-[#dcecdf]
                                          `
                                          : `
                                            bg-[#fbfdfc]
                                            border-[#e7efec]
                                          `
                                      }

                                      ${
                                        isLatestRoadmap &&
                                        savedTask
                                          ? `
                                            cursor-pointer
                                            hover:border-[#cfe2dc]
                                            hover:bg-[#f6faf8]
                                          `
                                          : `
                                            cursor-default
                                          `
                                      }
                                    `}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={
                                        isDone
                                      }
                                      disabled={
                                        !isLatestRoadmap ||
                                        !savedTask ||
                                        isUpdating
                                      }
                                      onChange={() =>
                                        savedTask &&
                                        handleTaskToggle(
                                          savedTask
                                        )
                                      }
                                      className="
                                        mt-[2px]
                                        w-4 h-4
                                        shrink-0
                                        accent-[#0f766e]
                                        cursor-pointer
                                        disabled:cursor-default
                                      "
                                    />

                                    <div className="flex-1 min-w-0">
                                      <p
                                        className={`
                                          m-0
                                          text-[14px]
                                          leading-5

                                          ${
                                            isDone
                                              ? "text-[#91a09d] line-through"
                                              : "text-[#526562]"
                                          }
                                        `}
                                      >
                                        {taskIndex +
                                          1}
                                        .{" "}
                                        {
                                          displayTitle
                                        }
                                      </p>

                                      {isUpdating && (
                                        <p
                                          className="
                                            m-0
                                            mt-1
                                            text-[11px]
                                            font-semibold
                                            text-[#0f766e]
                                          "
                                        >
                                          Saving...
                                        </p>
                                      )}

                                      {isDone &&
                                        !isUpdating && (
                                          <p
                                            className="
                                              m-0
                                              mt-1
                                              text-[11px]
                                              font-semibold
                                              text-[#39894a]
                                            "
                                          >
                                            Completed
                                          </p>
                                        )}
                                    </div>
                                  </label>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>

                      {/* OUTCOME */}

                      {phase.outcome && (
                        <div
                          className="
                            mt-5
                            flex
                            items-start
                            gap-3
                            p-4
                            rounded-xl
                            bg-[#f1f8f3]
                            border
                            border-[#dcecdf]
                          "
                        >
                          <div
                            className="
                              w-8 h-8
                              shrink-0
                              rounded-lg
                              bg-[#e3f3e6]
                              text-[#39894a]
                              flex
                              items-center
                              justify-center
                            "
                          >
                            <RoadmapIcon
                              type="trophy"
                              size={16}
                            />
                          </div>

                          <div>
                            <p
                              className="
                                m-0
                                text-[12px]
                                font-bold
                                uppercase
                                tracking-wide
                                text-[#39894a]
                              "
                            >
                              Phase Outcome
                            </p>

                            <p
                              className="
                                m-0 mt-1
                                text-[14px]
                                leading-5
                                text-[#526562]
                              "
                            >
                              {phase.outcome}
                            </p>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                }
              )}
            </div>
          </section>

          {/* ==================================
              HISTORY
          ================================== */}

          {history.length > 1 && (
            <section className="sb-card p-5 sm:p-6 mt-5">
              <SectionHeader
                icon="history"
                title="Roadmap History"
                description="Review your previous learning plans. Older plans are view-only."
              />

              <div className="space-y-2.5">
                {history.map(
                  (
                    oldRoadmap,
                    index
                  ) => {
                    const isCurrent =
                      roadmap
                        ?.roadmapId ===
                      oldRoadmap.roadmapId;

                    const isLatest =
                      index === 0;

                    return (
                      <button
                        type="button"
                        key={
                          oldRoadmap.roadmapId ||
                          index
                        }
                        onClick={() =>
                          handleHistorySelect(
                            oldRoadmap
                          )
                        }
                        className={`
                          w-full
                          text-left
                          flex
                          flex-col
                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                          gap-4
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
                              w-9 h-9
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
                            <RoadmapIcon
                              type="route"
                              size={17}
                            />
                          </div>

                          <div className="min-w-0">
                            <div
                              className="
                                flex
                                flex-wrap
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
                                "
                              >
                                {oldRoadmap.title}
                              </p>

                              {isLatest && (
                                <span
                                  className="
                                    px-2 py-[2px]
                                    rounded-full
                                    bg-[#dff1eb]
                                    text-[#0f766e]
                                    text-[11px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                  "
                                >
                                  Latest
                                </span>
                              )}

                              {isCurrent && (
                                <span
                                  className="
                                    px-2 py-[2px]
                                    rounded-full
                                    bg-white
                                    border
                                    border-[#d8e8e2]
                                    text-[#71817e]
                                    text-[11px]
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
                                m-0 mt-[3px]
                                text-[12px]
                                text-[#91a09d]
                              "
                            >
                              {oldRoadmap.role}
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
                                text-[14px]
                                font-semibold
                                text-[#0f766e]
                              "
                            >
                              {oldRoadmap.progressPercentage ||
                                0}
                              % complete
                            </p>

                            <p
                              className="
                                m-0 mt-[2px]
                                text-[11px]
                                text-[#91a09d]
                              "
                            >
                              {oldRoadmap.createdAt
                                ? new Date(
                                    oldRoadmap.createdAt
                                  ).toLocaleDateString()
                                : "Date unavailable"}
                            </p>
                          </div>

                          <span className="text-[#a4b1ae]">
                            <RoadmapIcon
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
        </>
      )}
    </PageLayout>
  );
}

export default Roadmap;