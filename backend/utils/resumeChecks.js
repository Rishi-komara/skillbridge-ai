const runResumeChecks = (resumeText) => {
  if (!resumeText || typeof resumeText !== "string") {
    throw new Error("Valid resume text is required");
  }

  const text = resumeText.toLowerCase();

  // ==========================================
  // 1. CONTACT INFORMATION CHECKS
  // ==========================================

  const hasEmail =
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(
      resumeText
    );

  const hasPhone =
    /(?:\+91[\s-]?)?[6-9]\d{9}\b/.test(
      resumeText.replace(/\s+/g, "")
    );

  const hasLinkedIn =
    text.includes("linkedin.com");

  const hasGitHub =
    text.includes("github.com");

  // ==========================================
  // 2. IMPORTANT RESUME SECTIONS
  // ==========================================

  const sectionChecks = {
    education:
      /\beducation\b/i.test(resumeText),

    skills:
      /\b(skills|technical skills)\b/i.test(
        resumeText
      ),

    projects:
      /\b(project|projects)\b/i.test(
        resumeText
      ),

    experience:
      /\b(experience|internship|internships)\b/i.test(
        resumeText
      ),

    objective:
      /\b(objective|summary|profile)\b/i.test(
        resumeText
      ),
  };

  // ==========================================
  // 3. COMMON TECHNICAL SKILLS
  // ==========================================

  const technicalSkills = [
    "java",
    "python",
    "javascript",
    "typescript",
    "react",
    "node",
    "express",
    "html",
    "css",
    "tailwind",
    "sql",
    "mysql",
    "mongodb",
    "firebase",
    "git",
    "github",
    "docker",
    "aws",
    "spring",
    "spring boot",
    "rest api",
    "data structures",
    "algorithms",
  ];

  const detectedSkills =
    technicalSkills.filter((skill) =>
      text.includes(skill)
    );

  // ==========================================
  // 4. ACTION VERBS
  // ==========================================

  const actionVerbs = [
    "developed",
    "built",
    "created",
    "implemented",
    "designed",
    "improved",
    "optimized",
    "integrated",
    "managed",
    "collaborated",
    "analyzed",
    "deployed",
  ];

  const detectedActionVerbs =
    actionVerbs.filter((verb) =>
      text.includes(verb)
    );

  // ==========================================
  // 5. BASIC LENGTH CHECK
  // ==========================================

  const wordCount = resumeText
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const reasonableLength =
    wordCount >= 150 && wordCount <= 1200;

  // ==========================================
  // 6. CALCULATE OBJECTIVE BASE SCORE
  // ==========================================

  let score = 0;

  // Contact details = 15 points
  if (hasEmail) score += 5;
  if (hasPhone) score += 5;
  if (hasLinkedIn || hasGitHub) score += 5;

  // Important sections = 35 points
  if (sectionChecks.education) score += 7;
  if (sectionChecks.skills) score += 7;
  if (sectionChecks.projects) score += 7;
  if (sectionChecks.experience) score += 7;
  if (sectionChecks.objective) score += 7;

  // Technical skills = maximum 20 points
  score += Math.min(
    detectedSkills.length * 2,
    20
  );

  // Action-oriented writing = maximum 15 points
  score += Math.min(
    detectedActionVerbs.length * 3,
    15
  );

  // Resume length = 15 points
  if (reasonableLength) {
    score += 15;
  }

  score = Math.min(score, 100);

  // ==========================================
  // RETURN STRUCTURED RESULT
  // ==========================================

  return {
    baseScore: score,

    wordCount,

    contact: {
      hasEmail,
      hasPhone,
      hasLinkedIn,
      hasGitHub,
    },

    sections: sectionChecks,

    detectedSkills,

    detectedActionVerbs,

    reasonableLength,
  };
};

export default runResumeChecks;