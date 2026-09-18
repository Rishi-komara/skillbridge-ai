import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-[#e7efec]
        bg-white/95
        backdrop-blur-md
      "
    >
      <nav
        className="
          max-w-[1380px]
          mx-auto
          px-5
          sm:px-8
          lg:px-12
          h-[72px]

          flex
          items-center
          justify-between
          gap-5
        "
      >
        {/* =================================
            LOGO
        ================================= */}

        <Link
          to="/"
          className="
            flex
            items-center
            gap-3
            no-underline
            shrink-0
          "
        >
          <div
            className="
              w-9
              h-9
              rounded-xl
              bg-[#0f766e]
              text-white

              flex
              items-center
              justify-center

              shadow-sm
            "
          >
            <svg
              width="19"
              height="19"
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

          <div className="leading-none">
            <p
              className="
                m-0
                text-[16px]
                sm:text-[17px]
                font-bold
                tracking-[-0.4px]
                text-[#163b38]
              "
            >
              SkillBridge
              <span className="text-[#0f766e]">
                {" "}
                AI
              </span>
            </p>

            <p
              className="
                hidden
                sm:block
                m-0
                mt-1
                text-[8px]
                uppercase
                tracking-[0.12em]
                font-semibold
                text-[#91a09d]
              "
            >
              Placement Preparation
            </p>
          </div>
        </Link>

        {/* =================================
            NAV LINKS
        ================================= */}

        <div
          className="
            hidden
            md:flex
            items-center
            gap-7
            ml-auto
            mr-4
          "
        >
          <a
            href="#features"
            className="
              text-[11px]
              font-semibold
              text-[#617572]
              hover:text-[#0f766e]
              transition-colors
            "
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="
              text-[11px]
              font-semibold
              text-[#617572]
              hover:text-[#0f766e]
              transition-colors
            "
          >
            How it works
          </a>
        </div>

        {/* =================================
            AUTH ACTIONS
        ================================= */}

        <div
          className="
            flex
            items-center
            gap-2
            sm:gap-3
          "
        >
          <Link
            to="/login"
            className="
              inline-flex
              items-center
              justify-center

              min-h-[40px]
              px-3
              sm:px-4

              rounded-xl

              text-[10px]
              sm:text-[11px]
              font-semibold
              text-[#526562]

              hover:bg-[#f4f8f6]
              hover:text-[#0f766e]

              transition-all
              duration-200
            "
          >
            Log in
          </Link>

          <Link
            to="/signup"
            className="
              inline-flex
              items-center
              justify-center
              gap-2

              min-h-[40px]
              px-4
              sm:px-5

              rounded-xl

              bg-[#0f766e]
              text-white

              text-[10px]
              sm:text-[11px]
              font-semibold

              shadow-sm

              hover:bg-[#0b5f59]
              hover:-translate-y-[1px]

              transition-all
              duration-200
            "
          >
            Get Started

            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;  