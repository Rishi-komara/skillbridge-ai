import roleSkills from "../data/roleSkills.js";

// ==========================================
// NORMALIZE SKILL NAME
// ==========================================

const normalizeSkill = (skill) => {
  return skill
    .toLowerCase()
    .trim()
    .replace(/\./g, "")
    .replace(/\s+/g, " ");
};

// ==========================================
// ANALYZE SKILL GAP
// ==========================================

const analyzeSkillGap = (
  selectedRole,
  resumeSkills = []
) => {
  // Check whether selected role exists
  const roleData =
    roleSkills[selectedRole];

  if (!roleData) {
    throw new Error(
      "Selected role is not supported"
    );
  }

  // Normalize resume skills
  const normalizedResumeSkills =
    resumeSkills.map(normalizeSkill);

  const requiredSkills = [];

  // Convert categories into one skill list
  Object.entries(
    roleData.categories
  ).forEach(([category, skills]) => {
    skills.forEach((skill) => {
      requiredSkills.push({
        name: skill,
        category,
      });
    });
  });

  const matchedSkills = [];
  const missingSkills = [];

  // ==========================================
  // COMPARE RESUME VS REQUIRED SKILLS
  // ==========================================

  requiredSkills.forEach((skill) => {
    const normalizedRequiredSkill =
      normalizeSkill(skill.name);

    const isMatched =
      normalizedResumeSkills.includes(
        normalizedRequiredSkill
      );

    if (isMatched) {
      matchedSkills.push({
        name: skill.name,
        category: skill.category,
        status: "Matched",
      });
    } else {
      missingSkills.push({
        name: skill.name,
        category: skill.category,
        status: "Missing",
      });
    }
  });

  // ==========================================
  // CALCULATE COMPLETION
  // ==========================================

  const totalRequiredSkills =
    requiredSkills.length;

  const matchedCount =
    matchedSkills.length;

  const missingCount =
    missingSkills.length;

  const skillCompletionPercentage =
    totalRequiredSkills > 0
      ? Math.round(
          (matchedCount /
            totalRequiredSkills) *
            100
        )
      : 0;

  const skillGapPercentage =
    100 - skillCompletionPercentage;

  return {
    role: selectedRole,

    totalRequiredSkills,

    matchedCount,

    missingCount,

    skillCompletionPercentage,

    skillGapPercentage,

    matchedSkills,

    missingSkills,
  };
};

export default analyzeSkillGap;