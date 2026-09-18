import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import DashboardTopbar from "../components/DashboardTopbar";
import ProgressCircle from "../components/ProgressCircle";
import { getDashboardStats } from "../services/dashboardService";
import Loader from "../components/Loader";

function DashboardWithAPI() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const activities = [
    "Resume uploaded",
    "Roadmap generated",
    "Mock interview completed",
    "Skill gap updated",
    "React practice done",
    "DBMS revision completed",
  ];

  const filteredActivities = activities.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      setStats(response.data.stats);
    } catch (err) {
      setError(err.message || "Failed to fetch stats");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar />

      <div className="flex-1 px-12 py-10 pb-32 fade-page">
        <DashboardTopbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <h1 className="text-4xl font-bold mb-4">Welcome Back 👋</h1>

        <p className="text-gray-300 mb-10">Track your placement progress.</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* stats */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 mt-12">
          <ProgressCircle
            value={stats?.placementReadiness || 0}
            label="Placement Readiness"
            emoji="🚀"
          />

          <ProgressCircle
            value={stats?.resumeScore || 0}
            label="Resume Score"
            emoji="📄"
          />

          <ProgressCircle
            value={stats?.interviewConfidence || 0}
            label="Interview Confidence"
            emoji="🎤"
          />

          <ProgressCircle
            value={stats?.skillCompletion || 0}
            label="Skill Completion"
            emoji="📈"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <StatsCard
            title="Readiness Score"
            value={`${stats?.placementReadiness || 0}%`}
          />

          <StatsCard
            title="Daily Streak"
            value={`${stats?.dailyStreak || 0} days`}
          />

          <StatsCard
            title="Tasks Completed"
            value={stats?.tasksCompleted || 0}
          />

          <StatsCard
            title="Last Updated"
            value="Just now"
          />
        </div>

        {/* recent activities */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Recent Activities</h2>
          <div className="space-y-3">
            {filteredActivities.map((activity, index) => (
              <div
                key={index}
                className="bg-white/5 border border-purple-500/20 rounded-lg p-4 hover:bg-white/10 transition"
              >
                {activity}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardWithAPI;
