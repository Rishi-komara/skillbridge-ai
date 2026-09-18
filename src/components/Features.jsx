const FeatureIcon = ({ type, size = 22 }) => {
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
        <path d="M6 3h8l4 4v14H6V3z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6" />
        <path d="M9 17h5" />
      </>
    ),

    target: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3" />
        <path d="M12 19v3" />
        <path d="M2 12h3" />
        <path d="M19 12h3" />
      </>
    ),

    roadmap: (
      <>
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="6" r="2" />
        <path d="M8 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3" />
      </>
    ),

    interview: (
      <>
        <rect
          x="8"
          y="3"
          width="8"
          height="12"
          rx="4"
        />
        <path d="M5 11a7 7 0 0 0 14 0" />
        <path d="M12 18v3" />
        <path d="M9 21h6" />
      </>
    ),

    dashboard: (
      <>
        <rect
          x="3"
          y="3"
          width="7"
          height="7"
          rx="1"
        />
        <rect
          x="14"
          y="3"
          width="7"
          height="7"
          rx="1"
        />
        <rect
          x="3"
          y="14"
          width="7"
          height="7"
          rx="1"
        />
        <rect
          x="14"
          y="14"
          width="7"
          height="7"
          rx="1"
        />
      </>
    ),

    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
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
// FEATURE CARD
// ==========================================

function FeatureCard({
  icon,
  number,
  title,
  description,
  points,
}) {
  return (
    <article
      className="
        group
        relative

        bg-white

        border
        border-[#e2ebe7]

        rounded-[20px]

        p-5
        sm:p-6

        transition-all
        duration-200

        hover:-translate-y-[2px]
        hover:border-[#cfe2da]

        hover:shadow-[0_16px_40px_rgba(35,82,72,0.08)]
      "
    >
      {/* NUMBER */}

      <span
        className="
          absolute
          top-5
          right-5

          text-[9px]
          font-bold
          tracking-[0.12em]
          text-[#b1bfbb]
        "
      >
        {number}
      </span>

      {/* ICON */}

      <div
        className="
          w-11
          h-11

          rounded-xl

          bg-[#e8f5f1]
          text-[#0f766e]

          flex
          items-center
          justify-center

          transition-all
          duration-200

          group-hover:bg-[#0f766e]
          group-hover:text-white
        "
      >
        <FeatureIcon
          type={icon}
          size={20}
        />
      </div>

      {/* TITLE */}

      <h3
        className="
          m-0
          mt-5

          text-[15px]
          font-semibold

          tracking-[-0.2px]

          text-[#163b38]
        "
      >
        {title}
      </h3>

      {/* DESCRIPTION */}

      <p
        className="
          m-0
          mt-2

          text-[10px]
          leading-5

          text-[#71817e]
        "
      >
        {description}
      </p>

      {/* POINTS */}

      <div
        className="
          mt-5
          pt-4

          border-t
          border-[#edf2f0]

          space-y-2.5
        "
      >
        {points.map((point) => (
          <div
            key={point}
            className="
              flex
              items-start
              gap-2

              text-[#617572]
            "
          >
            <span
              className="
                shrink-0
                mt-[1px]
                text-[#4caf50]
              "
            >
              <FeatureIcon
                type="check"
                size={13}
              />
            </span>

            <span
              className="
                text-[9px]
                leading-4
              "
            >
              {point}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

// ==========================================
// FEATURES
// ==========================================

function Features() {
  const features = [
    {
      number: "01",
      icon: "resume",
      title: "Resume Analyzer",

      description:
        "Review your uploaded resume with structured ATS-related checks and AI-assisted suggestions.",

      points: [
        "Resume structure and content checks",
        "Detected skills and keywords",
        "Strengths and improvement suggestions",
      ],
    },

    {
      number: "02",
      icon: "target",
      title: "Skill Gap Analysis",

      description:
        "Compare skills detected in your latest resume with the requirements of a selected target role.",

      points: [
        "Role-based skill comparison",
        "Matched and missing skills",
        "Learning priority guidance",
      ],
    },

    {
      number: "03",
      icon: "roadmap",
      title: "Preparation Roadmap",

      description:
        "Turn identified skill gaps into a structured preparation plan with phases, topics and tasks.",

      points: [
        "Personalized preparation phases",
        "Topic and task breakdown",
        "Task progress tracking",
      ],
    },

    {
      number: "04",
      icon: "interview",
      title: "Mock Interview Practice",

      description:
        "Practice common placement questions using typed answers or supported browser voice input.",

      points: [
        "Technical interview questions",
        "HR and DSA practice",
        "Text and voice answer practice",
      ],
    },

    {
      number: "05",
      icon: "dashboard",
      title: "Progress Dashboard",

      description:
        "View your latest resume and skill-gap progress from one simple preparation dashboard.",

      points: [
        "Latest resume score",
        "Skill completion overview",
        "Quick access to preparation tools",
      ],
    },
  ];

  return (
    <section
      id="features"
      className="
        bg-[#f4f8f6]

        border-y
        border-[#edf2f0]
      "
    >
      <div
        className="
          max-w-[1380px]
          mx-auto

          px-5
          sm:px-8
          lg:px-12

          py-16
          sm:py-20
          lg:py-24
        "
      >
        {/* =================================
            HEADER
        ================================= */}

        <div
          className="
            max-w-[650px]
            mx-auto
            text-center
          "
        >
          <div
            className="
              inline-flex
              items-center

              px-3
              py-1.5

              rounded-full

              bg-[#e8f5f1]

              border
              border-[#dce9e4]

              text-[9px]
              font-bold
              uppercase
              tracking-[0.12em]

              text-[#0f766e]
            "
          >
            Platform Features
          </div>

          <h2
            className="
              m-0
              mt-5

              text-[30px]
              sm:text-[36px]
              lg:text-[40px]

              leading-tight

              font-bold
              tracking-[-1.2px]

              text-[#102a2a]
            "
          >
            A structured way to prepare
            for placements
          </h2>

          <p
            className="
              m-0
              mt-4

              text-[12px]
              sm:text-[13px]

              leading-6

              text-[#71817e]
            "
          >
            SkillBridge brings resume
            analysis, role-based skill
            comparison, preparation
            planning and interview
            practice into one connected
            workflow.
          </p>
        </div>

        {/* =================================
            FEATURE GRID
        ================================= */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3

            gap-4
            lg:gap-5

            mt-10
            lg:mt-12
          "
        >
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
            />
          ))}

          {/* =================================
              CONNECTED WORKFLOW CARD
          ================================= */}

          <div
            className="
              relative
              overflow-hidden

              rounded-[20px]

              bg-[#e8f5f1]

              border
              border-[#cfe5dc]

              p-5
              sm:p-6

              min-h-[250px]

              flex
              flex-col
              justify-between

              transition-all
              duration-200

              hover:-translate-y-[2px]

              hover:shadow-[0_16px_40px_rgba(35,82,72,0.08)]
            "
          >
            {/* DECORATION */}

            <div
              className="
                absolute
                -right-14
                -top-14

                w-40
                h-40

                rounded-full

                bg-[#d5ebe3]

                opacity-70
              "
            />

            {/* CONTENT */}

            <div className="relative z-10">
              <p
                className="
                  m-0

                  text-[9px]
                  uppercase
                  tracking-[0.12em]
                  font-bold

                  text-[#0f766e]
                "
              >
                Connected Workflow
              </p>

              <h3
                className="
                  m-0
                  mt-3

                  max-w-[280px]

                  text-[20px]
                  leading-7
                  font-semibold

                  text-[#163b38]
                "
              >
                Prepare step by step,
                not with disconnected
                tools.
              </h3>

              <p
                className="
                  m-0
                  mt-3

                  max-w-[310px]

                  text-[10px]
                  leading-5

                  text-[#5f7470]
                "
              >
                Each stage of SkillBridge
                builds on your preparation
                journey from resume
                analysis to interview
                practice.
              </p>
            </div>

            {/* WORKFLOW STEPS */}

            <div
              className="
                relative
                z-10

                mt-6
                pt-4

                border-t
                border-[#cfe2da]
              "
            >
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                {[
                  "Analyze",
                  "Gap",
                  "Plan",
                  "Practice",
                ].map(
                  (step, index) => (
                    <div
                      key={step}
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <span
                        className="
                          px-2.5
                          py-1.5

                          rounded-lg

                          bg-white

                          border
                          border-[#cfe2da]

                          text-[9px]
                          font-semibold

                          text-[#0f766e]

                          shadow-sm
                        "
                      >
                        {step}
                      </span>

                      {index < 3 && (
                        <span
                          className="
                            text-[#6f9188]

                            text-[11px]
                            font-semibold
                          "
                        >
                          →
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;