import { Link } from "react-router-dom";

const HeroIcon = ({ type, size = 20 }) => {
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
    sparkle: (
      <>
        <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3z" />
        <path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" />
      </>
    ),

    resume: (
      <>
        <path d="M6 3h8l4 4v14H6V3z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6" />
        <path d="M9 17h5" />
      </>
    ),

    skills: (
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
        <rect x="8" y="3" width="8" height="12" rx="4" />
        <path d="M5 11a7 7 0 0 0 14 0" />
        <path d="M12 18v3" />
        <path d="M9 21h6" />
      </>
    ),

    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),

    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),
  };

  return <svg {...common}>{icons[type]}</svg>;
};

function WorkflowItem({
  number,
  icon,
  title,
  description,
  last = false,
}) {
  return (
    <div className="relative flex gap-4">
      {!last && (
        <div
          className="
            absolute
            left-[19px]
            top-[42px]
            bottom-[-18px]
            w-px
            bg-[#dce9e4]
          "
        />
      )}

      <div
        className="
          relative
          z-10
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
        <HeroIcon type={icon} size={17} />
      </div>

      <div className="pb-5">
        <div className="flex items-center gap-2">
          <span
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.1em]
              text-[#91a09d]
            "
          >
            Step {number}
          </span>
        </div>

        <h3
          className="
            m-0
            mt-1
            text-[12px]
            font-semibold
            text-[#163b38]
          "
        >
          {title}
        </h3>

        <p
          className="
            m-0
            mt-1
            text-[10px]
            leading-5
            text-[#71817e]
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <main>
      {/* =====================================
          HERO
      ===================================== */}

      <section
        id="how-it-works"
        className="
          relative
          overflow-hidden
          bg-white
        "
      >
        {/* subtle background */}

        <div
          className="
            pointer-events-none
            absolute
            top-[-180px]
            left-[-160px]
            w-[480px]
            h-[480px]
            rounded-full
            bg-[#e8f5f1]
            blur-[90px]
            opacity-70
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            right-[-180px]
            bottom-[-200px]
            w-[500px]
            h-[500px]
            rounded-full
            bg-[#f0f8f4]
            blur-[100px]
          "
        />

        <div
          className="
            relative
            z-10

            max-w-[1380px]
            mx-auto

            px-5
            sm:px-8
            lg:px-12

            pt-16
            sm:pt-20
            lg:pt-24

            pb-16
            sm:pb-20
            lg:pb-24

            grid
            grid-cols-1
            lg:grid-cols-[1.05fr_0.95fr]
            items-center

            gap-12
            lg:gap-16
          "
        >
          {/* =================================
              LEFT
          ================================= */}

          <div className="max-w-[680px]">
            {/* badge */}

            <div
              className="
                inline-flex
                items-center
                gap-2

                px-3.5
                py-2

                rounded-full

                bg-[#f1f8f5]

                border
                border-[#dce9e4]

                text-[10px]
                font-semibold
                text-[#0f766e]
              "
            >
              <HeroIcon
                type="sparkle"
                size={14}
              />

              AI-assisted placement preparation
            </div>

            {/* heading */}

            <h1
              className="
                m-0
                mt-6

                text-[40px]
                sm:text-[50px]
                lg:text-[58px]

                leading-[1.08]

                font-bold
                tracking-[-2px]

                text-[#102a2a]
              "
            >
              Prepare smarter for
              your{" "}
              <span className="text-[#0f766e]">
                placement journey.
              </span>
            </h1>

            {/* description */}

            <p
              className="
                m-0
                mt-6

                max-w-[610px]

                text-[14px]
                sm:text-[15px]

                leading-7

                text-[#647575]
              "
            >
              Analyze your resume,
              identify role-based skill
              gaps, build a personalized
              preparation roadmap and
              practice interview
              questions — all in one
              structured platform.
            </p>

            {/* actions */}

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-3
                mt-8
              "
            >
              <Link
                to="/signup"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2

                  min-h-[46px]

                  px-6

                  rounded-xl

                  bg-[#0f766e]
                  text-white

                  text-[11px]
                  font-semibold

                  shadow-sm

                  hover:bg-[#0b5f59]
                  hover:-translate-y-[1px]

                  transition-all
                  duration-200
                "
              >
                Start Preparing

                <HeroIcon
                  type="arrow"
                  size={15}
                />
              </Link>

              <Link
                to="/login"
                className="
                  inline-flex
                  items-center
                  justify-center

                  min-h-[46px]

                  px-6

                  rounded-xl

                  bg-white

                  border
                  border-[#dce9e4]

                  text-[11px]
                  font-semibold
                  text-[#526562]

                  hover:bg-[#f4f8f6]
                  hover:text-[#0f766e]

                  transition-all
                  duration-200
                "
              >
                I already have an account
              </Link>
            </div>

            {/* feature points */}

            <div
              className="
                flex
                flex-wrap
                gap-x-5
                gap-y-2
                mt-7
              "
            >
              {[
                "Resume analysis",
                "Skill-gap insights",
                "Preparation roadmap",
              ].map((item) => (
                <div
                  key={item}
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-[#71817e]
                  "
                >
                  <span className="text-[#4caf50]">
                    <HeroIcon
                      type="check"
                      size={13}
                    />
                  </span>

                  <span
                    className="
                      text-[9px]
                      font-medium
                    "
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* =================================
              RIGHT PRODUCT PREVIEW
          ================================= */}

          <div
            className="
              relative
              w-full
              max-w-[560px]
              mx-auto
              lg:ml-auto
            "
          >
            {/* decorative back card */}

            <div
              className="
                absolute
                -inset-3
                sm:-inset-4

                rounded-[28px]

                bg-[#e8f5f1]

                rotate-[2deg]
              "
            />

            {/* main preview */}

            <div
              className="
                relative

                bg-white

                border
                border-[#dce9e4]

                rounded-[24px]

                shadow-[0_22px_60px_rgba(35,82,72,0.12)]

                overflow-hidden
              "
            >
              {/* preview topbar */}

              <div
                className="
                  flex
                  items-center
                  justify-between

                  px-5
                  py-4

                  border-b
                  border-[#edf2f0]
                "
              >
                <div className="flex items-center gap-2">
                  <div
                    className="
                      w-8
                      h-8
                      rounded-lg
                      bg-[#0f766e]
                      text-white
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <HeroIcon
                      type="sparkle"
                      size={15}
                    />
                  </div>

                  <div>
                    <p
                      className="
                        m-0
                        text-[10px]
                        font-semibold
                        text-[#163b38]
                      "
                    >
                      SkillBridge AI
                    </p>

                    <p
                      className="
                        m-0
                        mt-0.5
                        text-[8px]
                        text-[#91a09d]
                      "
                    >
                      Preparation workflow
                    </p>
                  </div>
                </div>

                <span
                  className="
                    px-2.5
                    py-1
                    rounded-full
                    bg-[#edf8ee]
                    text-[#39894a]
                    text-[8px]
                    font-bold
                  "
                >
                  4 Steps
                </span>
              </div>

              {/* workflow */}

              <div className="p-5 sm:p-6">
                <div className="mb-5">
                  <p
                    className="
                      m-0
                      text-[9px]
                      uppercase
                      tracking-[0.12em]
                      font-semibold
                      text-[#0f766e]
                    "
                  >
                    Your preparation flow
                  </p>

                  <h2
                    className="
                      m-0
                      mt-1
                      text-[17px]
                      font-semibold
                      text-[#163b38]
                    "
                  >
                    From resume to interview
                    practice
                  </h2>
                </div>

                <WorkflowItem
                  number="01"
                  icon="resume"
                  title="Analyze Resume"
                  description="Upload your resume to review its structure, skills and ATS-related checks."
                />

                <WorkflowItem
                  number="02"
                  icon="skills"
                  title="Identify Skill Gaps"
                  description="Compare detected resume skills with the selected role requirements."
                />

                <WorkflowItem
                  number="03"
                  icon="roadmap"
                  title="Build Your Roadmap"
                  description="Turn identified gaps into a structured learning and preparation plan."
                />

                <WorkflowItem
                  number="04"
                  icon="interview"
                  title="Practice Interviews"
                  description="Practice technical, HR and DSA questions using text or voice."
                  last
                />

                {/* bottom status */}

                <div
                  className="
                    mt-1
                    p-3.5

                    rounded-xl

                    bg-[#f8fbfa]

                    border
                    border-[#e7efec]

                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        m-0
                        text-[9px]
                        font-semibold
                        text-[#405653]
                      "
                    >
                      One connected workflow
                    </p>

                    <p
                      className="
                        m-0
                        mt-0.5
                        text-[8px]
                        text-[#91a09d]
                      "
                    >
                      Analyze → Gap → Plan → Practice
                    </p>
                  </div>

                  <div
                    className="
                      w-8
                      h-8
                      shrink-0
                      rounded-lg
                      bg-[#e8f5f1]
                      text-[#0f766e]
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <HeroIcon
                      type="arrow"
                      size={15}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Hero;