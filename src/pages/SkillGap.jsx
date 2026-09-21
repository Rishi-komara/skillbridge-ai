import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import apiClient from "../config/api";

function SkillGap() {
  const [roles, setRoles] = useState([]);

  const [branches, setBranches] =
    useState({});

  const [selectedBranch, setSelectedBranch] =
    useState("");

  const [selectedRole, setSelectedRole] =
    useState("");

  const [analysis, setAnalysis] =
    useState(null);

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD BRANCHES + ROLES + PREVIOUS ANALYSIS
  // ==========================================

  useEffect(() => {
    const loadSkillGapData = async () => {
      try {
        setPageLoading(true);
        setError("");

        const [rolesResponse, historyResponse] =
          await Promise.all([
            apiClient.get(
              "/skill-gap/roles"
            ),

            apiClient.get(
              "/skill-gap/history"
            ),
          ]);

        const availableRoles =
          rolesResponse.data.roles || [];

        const availableBranches =
          rolesResponse.data.branches || {};

        setRoles(availableRoles);
        setBranches(availableBranches);

        const branchNames =
          Object.keys(availableBranches);

        // ======================================
        // DEFAULT BRANCH + ROLE
        // ======================================

        if (branchNames.length > 0) {
          const firstBranch =
            branchNames[0];

          setSelectedBranch(
            firstBranch
          );

          const firstRole =
            availableBranches[
              firstBranch
            ]?.[0] || "";

          setSelectedRole(firstRole);
        } else if (
          availableRoles.length > 0
        ) {
          // Backward compatibility
          setSelectedRole(
            availableRoles[0]
          );
        }

        const history =
          historyResponse.data.history ||
          [];

        // Backend returns latest first
        if (history.length > 0) {
          const latestAnalysis =
            history[0];

          setAnalysis(
            latestAnalysis
          );

          const savedRole =
            latestAnalysis.role;

          setSelectedRole(savedRole);

          // Find branch belonging to
          // the previously saved role
          const savedBranch =
            Object.entries(
              availableBranches
            ).find(
              ([, branchRoles]) =>
                branchRoles.includes(
                  savedRole
                )
            )?.[0];

          if (savedBranch) {
            setSelectedBranch(
              savedBranch
            );
          }
        }
      } catch (err) {
        console.error(
          "Skill Gap Load Error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load skill gap data"
        );
      } finally {
        setPageLoading(false);
      }
    };

    loadSkillGapData();
  }, []);

  // ==========================================
  // FILTER ROLES BY SELECTED BRANCH
  // ==========================================

  const filteredRoles =
    selectedBranch &&
    branches[selectedBranch]
      ? branches[selectedBranch]
      : roles;

  // ==========================================
  // HANDLE BRANCH CHANGE
  // ==========================================

  const handleBranchChange = (event) => {
    const branch =
      event.target.value;

    setSelectedBranch(branch);

    const firstRole =
      branches[branch]?.[0] || "";

    setSelectedRole(firstRole);

    setError("");
  };

  // ==========================================
  // HANDLE ROLE CHANGE
  // ==========================================

  const handleRoleChange = (event) => {
    setSelectedRole(
      event.target.value
    );

    setError("");
  };

  // ==========================================
  // ANALYZE SKILL GAP
  // ==========================================

  const handleAnalyze = async () => {
    if (!selectedRole) {
      setError(
        "Please select a target role"
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await apiClient.post(
          "/skill-gap/analyze",
          {
            role: selectedRole,
          }
        );

      console.log(
        "Skill Gap Analysis:",
        response.data
      );

      setAnalysis(
        response.data
      );

      setActiveCategory("All");
    } catch (err) {
      console.error(
        "Skill Gap Analysis Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to analyze skill gap"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // COMBINE MATCHED + MISSING SKILLS
  // ==========================================

  const matchedSkills =
    analysis?.matchedSkills || [];

  const missingSkills =
    analysis?.missingSkills || [];

  const allSkills = [
    ...matchedSkills.map(
      (skill) => ({
        ...skill,
        priority: "Done",
      })
    ),

    ...missingSkills.map(
      (skill) => ({
        ...skill,
        priority:
          skill.priority || "Medium",
      })
    ),
  ];

  // ==========================================
  // CREATE CATEGORY FILTERS
  // ==========================================

  const categories = [
    "All",
    ...new Set(
      allSkills
        .map(
          (skill) =>
            skill.category
        )
        .filter(Boolean)
    ),
  ];

  // ==========================================
  // FILTER SKILLS
  // ==========================================

  const filteredSkills =
    activeCategory === "All"
      ? allSkills
      : allSkills.filter(
          (item) =>
            item.category ===
            activeCategory
        );

  // ==========================================
  // BADGE COLOR
  // ==========================================

  const badgeColor = (value) => {
    if (value === "Done") {
      return "bg-green-600";
    }

    if (value === "High") {
      return "bg-red-500";
    }

    if (value === "Medium") {
      return "bg-yellow-500";
    }

    return "bg-blue-500";
  };

  return (
    <PageLayout
      title="Skill Gap Analysis"
      subtitle="Compare your resume skills with the curated requirements for your target role."
    >
      {/* ======================================
          BRANCH + ROLE SELECTION
      ====================================== */}

      <div
        className="
          bg-white
          border
          border-[#e2ebe7]
          rounded-3xl
          p-8
          mb-8
        "
      >
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
            mb-4
          "
        >
          {/* BRANCH / DOMAIN */}

          <div>
            <p className="text-[#71817e] text-[14px] font-medium mb-3">
              Branch / Domain
            </p>

            <select
              value={selectedBranch}
              onChange={
                handleBranchChange
              }
              disabled={
                pageLoading ||
                loading
              }
              className="
                w-full
                bg-white
                border
                border-[#e2ebe7]
                rounded-2xl
                px-6
                py-4
                text-[14px]
                text-[#163b38]
                outline-none
                focus:border-[#0f766e]
                transition
              "
            >
              {Object.keys(
                branches
              ).length === 0 && (
                <option value="">
                  No branches available
                </option>
              )}

              {Object.keys(
                branches
              ).map((branch) => (
                <option
                  key={branch}
                  value={branch}
                >
                  {branch}
                </option>
              ))}
            </select>
          </div>

          {/* TARGET ROLE */}

          <div>
            <p className="text-[#71817e] text-[14px] font-medium mb-3">
              Target Role
            </p>

            <select
              value={selectedRole}
              onChange={
                handleRoleChange
              }
              disabled={
                pageLoading ||
                loading ||
                filteredRoles.length ===
                  0
              }
              className="
                w-full
                bg-white
                border
                border-[#e2ebe7]
                rounded-2xl
                px-6
                py-4
                text-[14px]
                text-[#163b38]
                outline-none
                focus:border-[#0f766e]
                transition
              "
            >
              {filteredRoles.length ===
                0 && (
                <option value="">
                  No roles available
                </option>
              )}

              {filteredRoles.map(
                (role) => (
                  <option
                    key={role}
                    value={role}
                  >
                    {role}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={
            loading ||
            pageLoading ||
            !selectedRole
          }
          className="
            bg-[#0f766e]
            hover:bg-[#0b5f59]
            disabled:opacity-50
            disabled:cursor-not-allowed
            px-7
            py-4
            rounded-2xl
            font-semibold
            text-white
            transition
          "
        >
          {loading
            ? "Analyzing..."
            : "Analyze Skill Gap"}
        </button>

        <p className="text-[#71817e] text-[12px] mt-4">
          Analysis uses your latest
          analyzed resume and curated
          requirements for the selected
          role.
        </p>
      </div>

      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div
          className="
            bg-red-500/10
            border
            border-red-500/20
            rounded-2xl
            p-4
            mb-8
          "
        >
          <p className="text-[#b64f48] text-[14px] font-medium">
            ⚠️ {error}
          </p>
        </div>
      )}

      {/* ======================================
          LOADING
      ====================================== */}

      {(pageLoading || loading) && (
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-5">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="sb-card p-5 min-h-[145px] animate-pulse"
              >
                <div className="w-10 h-10 rounded-xl bg-[#e8efec] mb-5" />
                <div className="w-24 h-3 rounded bg-[#e8efec]" />
                <div className="w-16 h-7 rounded bg-[#e8efec] mt-3" />
              </div>
            )
          )}
        </section>
      )}

      {/* ======================================
          ANALYSIS RESULTS
      ====================================== */}

      {!pageLoading &&
        !loading &&
        analysis && (
          <>
            {/* SCORE CARDS */}

            <div
              className="
                grid
                md:grid-cols-2
                xl:grid-cols-4
                gap-6
                mb-10
              "
            >
              <div className="sb-card p-5">
                <p className="text-[#71817e] text-[14px] font-medium mb-3">
                  Skill Completion
                </p>

                <p className="text-[27px] font-semibold text-[#163b38]">
                  {analysis.skillCompletionPercentage ??
                    0}
                  %
                </p>
              </div>

              <div className="sb-card p-5">
                <p className="text-[#71817e] text-[14px] font-medium mb-3">
                  Skill Gap
                </p>

                <p className="text-[27px] font-semibold text-[#163b38]">
                  {analysis.skillGapPercentage ??
                    0}
                  %
                </p>
              </div>

              <div className="sb-card p-5">
                <p className="text-[#71817e] text-[14px] font-medium mb-3">
                  Matched Skills
                </p>

                <p className="text-[27px] font-semibold text-[#163b38]">
                  {analysis.matchedCount ??
                    0}
                </p>
              </div>

              <div className="sb-card p-5">
                <p className="text-[#71817e] text-[14px] font-medium mb-3">
                  Missing Skills
                </p>

                <p className="text-[27px] font-semibold text-[#163b38]">
                  {analysis.missingCount ??
                    0}
                </p>
              </div>
            </div>

            {/* ======================================
                AI SUMMARY
            ====================================== */}

            <div
              className="
                bg-white
                border
                border-[#e2ebe7]
                rounded-3xl
                p-8
                mb-10
              "
            >
              <h2 className="text-[17px] font-semibold text-[#163b38] mb-4">
                🤖 AI Skill Gap Summary
              </h2>

              <p className="text-[14px] text-[#526562] leading-6">
                {analysis.summary ||
                  "No summary available."}
              </p>
            </div>

            {/* ======================================
                CATEGORY FILTERS
            ====================================== */}

            {allSkills.length > 0 && (
              <div className="flex flex-wrap gap-4 mb-10">
                {categories.map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setActiveCategory(
                          item
                        )
                      }
                      className={`
                        px-5
                        py-3
                        rounded-2xl
                        transition
                        ${
                          activeCategory ===
                          item
                            ? "bg-[#0f766e] text-white"
                            : "bg-white text-[#526562] border border-[#e2ebe7] hover:bg-[#f4f8f6]"
                        }
                      `}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            )}

            {/* ======================================
                SKILL CARDS
            ====================================== */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredSkills.map(
                (item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="
                      bg-white
                      border
                      border-[#e2ebe7]
                      rounded-3xl
                      p-8
                    "
                  >
                    <div
                      className="
                        flex
                        justify-between
                        items-start
                        gap-5
                      "
                    >
                      <div>
                        <h2 className="text-[17px] font-semibold text-[#405653]">
                          {item.name}
                        </h2>

                        <p className="text-[13px] text-[#71817e] mt-1">
                          {item.category}
                        </p>
                      </div>

                      <span
                        className={`
                          ${badgeColor(
                            item.priority
                          )}
                          px-4
                          py-2
                          rounded-full
                          text-sm
                          text-white
                          whitespace-nowrap
                        `}
                      >
                        {item.priority}
                      </span>
                    </div>

                    {/* AI reason for missing skill */}

                    {item.priority !==
                      "Done" &&
                      item.reason && (
                        <p className="text-[#71817e] text-[14px] mt-5 leading-6">
                          {item.reason}
                        </p>
                      )}
                  </div>
                )
              )}
            </div>

            {/* ======================================
                LEARNING ORDER
            ====================================== */}

            {analysis.learningOrder
              ?.length > 0 && (
              <div
                className="
                  bg-white
                  border
                  border-[#e2ebe7]
                  rounded-3xl
                  p-8
                  mt-10
                "
              >
                <h2 className="text-[17px] font-semibold text-[#163b38] mb-5">
                  🎯 Recommended Learning
                  Order
                </h2>

                <div className="space-y-4">
                  {analysis.learningOrder.map(
                    (skill, index) => (
                      <div
                        key={`${skill}-${index}`}
                        className="
                          bg-[#f8fbfa]
                          rounded-2xl
                          p-5
                          flex
                          items-center
                          gap-5
                        "
                      >
                        <div
                          className="
                            w-10
                            h-10
                            bg-[#0f766e]
                            rounded-full
                            flex
                            items-center
                            justify-center
                            font-bold
                            text-white
                            shrink-0
                          "
                        >
                          {index + 1}
                        </div>

                        <p className="font-medium text-[#405653]">
                          {skill}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* ANALYSIS INFO */}

            <div className="mt-5 text-[#71817e] text-[12px] leading-5">
              Role requirements are curated
              by SkillBridge AI. Skill matching
              is based on skills detected in
              your latest analyzed resume.
            </div>
          </>
        )}

      {/* ======================================
          EMPTY STATE
      ====================================== */}

      {!pageLoading &&
        !loading &&
        !analysis &&
        !error && (
          <div
            className="
              bg-white
              border
              border-[#e2ebe7]
              rounded-3xl
              p-12
              text-center
            "
          >
            <div className="text-5xl mb-5">
              🎯
            </div>

            <h2 className="text-[17px] font-semibold text-[#405653]">
              Select your branch and target
              role
            </h2>

            <p className="text-[14px] text-[#71817e] mt-3">
              Analyze your latest resume to
              identify matched and missing
              skills.
            </p>
          </div>
        )}
    </PageLayout>
  );
}

export default SkillGap;