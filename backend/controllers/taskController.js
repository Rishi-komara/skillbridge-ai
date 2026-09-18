import { db } from "../config/firebase.js";

// ==========================================
// GET DAILY TASKS FROM LATEST ROADMAP
// ==========================================

export const getDailyTasks = async (req, res) => {
  try {
    const uid = req.uid;

    // Get user's roadmap history
    const snapshot = await db
      .ref(`users/${uid}/roadmaps`)
      .once("value");

    if (!snapshot.exists()) {
      return res.status(200).json({
        success: true,
        message: "Generate a roadmap first",
        tasks: [],
        progressPercentage: 0,
      });
    }

    // Convert Firebase object -> array
    const roadmaps = Object.values(snapshot.val());

    // Latest roadmap first
    roadmaps.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    const latestRoadmap = roadmaps[0];

    // ======================================
    // BUILD TASK LIST FROM ROADMAP PHASES
    // ======================================

    const tasks = [];

    (latestRoadmap.phases || []).forEach(
      (phase, phaseIndex) => {
        (phase.tasks || []).forEach(
          (task, taskIndex) => {
            const taskId =
              `p${phaseIndex + 1}-t${taskIndex + 1}`;

            const savedTask =
              latestRoadmap.taskProgress?.[taskId];

            tasks.push({
              taskId,
              phase: phase.phase || phaseIndex + 1,
              skill: phase.skill || "",
              title:
                typeof task === "string"
                  ? task
                  : task.title || "Task",

              done:
                savedTask?.done || false,
            });
          }
        );
      }
    );

    // ======================================
    // CALCULATE PROGRESS
    // ======================================

    const completedTasks =
      tasks.filter((task) => task.done).length;

    const progressPercentage =
      tasks.length > 0
        ? Math.round(
            (completedTasks / tasks.length) * 100
          )
        : 0;

    return res.status(200).json({
      success: true,

      roadmapId:
        latestRoadmap.roadmapId,

      role:
        latestRoadmap.role,

      totalTasks:
        tasks.length,

      completedTasks,

      progressPercentage,

      tasks,
    });
  } catch (error) {
    console.error(
      "Get Daily Tasks Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch daily tasks",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE TASK STATUS
// ==========================================

export const updateTaskStatus = async (
  req,
  res
) => {
  try {
    const uid = req.uid;

    const {
      roadmapId,
      taskId,
      done,
    } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (!roadmapId) {
      return res.status(400).json({
        success: false,
        message: "Roadmap ID is required",
      });
    }

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required",
      });
    }

    if (typeof done !== "boolean") {
      return res.status(400).json({
        success: false,
        message:
          "Task status must be true or false",
      });
    }

    // ======================================
    // CHECK ROADMAP EXISTS
    // ======================================

    const roadmapRef = db.ref(
      `users/${uid}/roadmaps/${roadmapId}`
    );

    const roadmapSnapshot =
      await roadmapRef.once("value");

    if (!roadmapSnapshot.exists()) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

    const roadmap =
      roadmapSnapshot.val();

    // ======================================
    // BUILD VALID TASK IDS
    // Prevent fake task IDs
    // ======================================

    const validTaskIds = [];

    (roadmap.phases || []).forEach(
      (phase, phaseIndex) => {
        (phase.tasks || []).forEach(
          (task, taskIndex) => {
            validTaskIds.push(
              `p${phaseIndex + 1}-t${taskIndex + 1}`
            );
          }
        );
      }
    );

    if (!validTaskIds.includes(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    // ======================================
    // SAVE TASK STATUS
    // ======================================

    await roadmapRef
      .child(`taskProgress/${taskId}`)
      .set({
        done,
        updatedAt:
          new Date().toISOString(),
      });

    // ======================================
    // READ UPDATED ROADMAP
    // ======================================

    const updatedSnapshot =
      await roadmapRef.once("value");

    const updatedRoadmap =
      updatedSnapshot.val();

    const totalTasks =
      validTaskIds.length;

    let completedTasks = 0;

    validTaskIds.forEach((id) => {
      if (
        updatedRoadmap.taskProgress?.[id]
          ?.done === true
      ) {
        completedTasks++;
      }
    });

    const progressPercentage =
      totalTasks > 0
        ? Math.round(
            (completedTasks / totalTasks) *
              100
          )
        : 0;

    // ======================================
    // SAVE ROADMAP PROGRESS
    // ======================================

    await roadmapRef.update({
      progressPercentage,
    });

    console.log(
      `Task ${taskId} updated:`,
      done
    );

    console.log(
      `Roadmap progress: ${progressPercentage}%`
    );

    return res.status(200).json({
      success: true,
      message:
        "Task status updated successfully",

      taskId,
      done,

      totalTasks,
      completedTasks,
      progressPercentage,
    });
  } catch (error) {
    console.error(
      "Update Task Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update task status",
      error: error.message,
    });
  }
};