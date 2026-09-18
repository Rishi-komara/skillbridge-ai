import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      className="
        bg-white
        border-t
        border-[#e2ebe7]
      "
    >
      <div
        className="
          max-w-[1380px]
          mx-auto

          px-5
          sm:px-8
          lg:px-12

          py-8
        "
      >
        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between

            gap-6
          "
        >
          {/* LEFT */}

          <div>
            <Link
              to="/"
              className="
                inline-flex
                items-center
                gap-2.5
                no-underline
              "
            >
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
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19V9" />
                  <path d="M10 19V5" />
                  <path d="M16 19v-7" />
                  <path d="M22 19V3" />
                </svg>
              </div>

              <span
                className="
                  text-[14px]
                  font-bold
                  tracking-[-0.3px]
                  text-[#163b38]
                "
              >
                SkillBridge
                <span className="text-[#0f766e]">
                  {" "}AI
                </span>
              </span>
            </Link>

            <p
              className="
                m-0
                mt-2

                max-w-[360px]

                text-[9px]
                leading-4
                text-[#91a09d]
              "
            >
              A structured placement
              preparation platform for
              resume analysis, skill-gap
              identification, roadmaps
              and interview practice.
            </p>
          </div>

          {/* RIGHT */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-5
              gap-y-3
            "
          >
            <a
              href="#features"
              className="
                text-[9px]
                font-semibold
                text-[#71817e]

                hover:text-[#0f766e]
                transition-colors
              "
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="
                text-[9px]
                font-semibold
                text-[#71817e]

                hover:text-[#0f766e]
                transition-colors
              "
            >
              How it works
            </a>

            <Link
              to="/login"
              className="
                text-[9px]
                font-semibold
                text-[#71817e]

                hover:text-[#0f766e]
                transition-colors
              "
            >
              Log in
            </Link>

            <Link
              to="/signup"
              className="
                text-[9px]
                font-semibold
                text-[#0f766e]

                hover:text-[#0b5f59]
                transition-colors
              "
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* BOTTOM */}

        <div
          className="
            mt-7
            pt-5

            border-t
            border-[#edf2f0]

            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between

            gap-2
          "
        >
          <p
            className="
              m-0
              text-[8px]
              text-[#a1afac]
            "
          >
            © 2026 SkillBridge AI.
            All rights reserved.
          </p>

          <p
            className="
              m-0
              text-[8px]
              text-[#a1afac]
            "
          >
            Built for placement preparation.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;