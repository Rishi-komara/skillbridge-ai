import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

// ==========================================
// ICONS
// ==========================================

const Icon = ({ type }) => {
  const common = {
    width: 19,
    height: 19,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),

    resume: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h6" />
      </>
    ),

    skills: (
      <>
        <path d="M4 19V9" />
        <path d="M10 19V5" />
        <path d="M16 19v-7" />
        <path d="M22 19V3" />
      </>
    ),

    roadmap: (
      <>
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="6" r="2" />
        <path d="M8 18h3a3 3 0 0 0 3-3v-6a3 3 0 0 1 3-3" />
      </>
    ),

    interview: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <circle cx="12" cy="9" r="2.5" />
        <path d="M8 17c.8-2 2.1-3 4-3s3.2 1 4 3" />
      </>
    ),

    profile: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),

    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
      </>
    ),

    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),

    close: (
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6L6 18" />
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
// SIDEBAR
// ==========================================

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] =
    useState(false);

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await logout();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Logout Error:",
        error
      );
    } finally {
      setLoggingOut(false);
    }
  };

  // ========================================
  // MENU
  // ========================================

  const mainMenu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "dashboard",
    },
  ];

  const preparationMenu = [
    {
      name: "Resume Analyzer",
      path: "/resume",
      icon: "resume",
    },
    {
      name: "Skill Gap",
      path: "/skill-gap",
      icon: "skills",
    },
    {
      name: "Roadmap",
      path: "/roadmap",
      icon: "roadmap",
    },
    {
      name: "Mock Interview",
      path: "/mock-interview",
      icon: "interview",
    },
  ];

  const accountMenu = [
    {
      name: "Profile",
      path: "/profile",
      icon: "profile",
    },
  ];

  // ========================================
  // MENU ITEM
  // ========================================

  const renderMenuItem = (item) => {
    const active =
      location.pathname === item.path;

    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={() => setOpen(false)}
        className={`
          group
          flex
          items-center
          gap-3
          min-h-[44px]
          px-3
          rounded-xl
          text-[14px]
          font-medium
          transition-all
          duration-200

          ${
            active
              ? `
                bg-[#e8f5f1]
                text-[#0f766e]
                font-semibold
              `
              : `
                text-[#667775]
                hover:bg-[#f3f8f6]
                hover:text-[#163b38]
              `
          }
        `}
      >
        <span
          className={`
            flex
            items-center
            justify-center
            transition-colors
            duration-200

            ${
              active
                ? "text-[#0f766e]"
                : "text-[#849491] group-hover:text-[#0f766e]"
            }
          `}
        >
          <Icon type={item.icon} />
        </span>

        <span>{item.name}</span>

        {active && (
          <span
            className="
              ml-auto
              w-1.5
              h-1.5
              rounded-full
              bg-[#0f766e]
            "
          />
        )}
      </Link>
    );
  };

  // ========================================
  // SECTION TITLE
  // ========================================

  const SectionTitle = ({
    children,
  }) => (
    <p
      className="
        px-3
        mt-6
        mb-2
        text-[10px]
        font-bold
        tracking-[0.14em]
        uppercase
        text-[#a0adaa]
      "
    >
      {children}
    </p>
  );

  return (
    <>
      {/* ====================================
          MOBILE MENU BUTTON
      ==================================== */}

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        className="
          lg:hidden

          fixed
          top-4
          left-4
          z-[60]

          w-11
          h-11

          flex
          items-center
          justify-center

          bg-white
          text-[#163b38]

          border
          border-[#e2ebe7]

          rounded-xl

          shadow-sm

          transition-all
          duration-200

          hover:bg-[#f3f8f6]
        "
      >
        <Icon type="menu" />
      </button>

      {/* ====================================
          MOBILE OVERLAY
      ==================================== */}

      {open && (
        <div
          className="
            lg:hidden
            fixed
            inset-0
            z-40
            bg-black/25
            backdrop-blur-[2px]
          "
          onClick={() =>
            setOpen(false)
          }
        />
      )}

      {/* ====================================
          SIDEBAR
      ==================================== */}

      <aside
        className={`
          fixed
          lg:sticky

          top-0
          left-0

          z-50

          w-[250px]
          h-screen

          bg-white

          border-r
          border-[#e2ebe7]

          flex
          flex-col

          transition-transform
          duration-300
          ease-out

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* ==================================
            LOGO
        ================================== */}

        <div
          className="
            h-[76px]
            px-6

            flex
            items-center
            justify-between

            border-b
            border-[#edf2f0]
          "
        >
          <Link
            to="/dashboard"
            onClick={() =>
              setOpen(false)
            }
            className="
              flex
              items-center
              gap-3
            "
          >
            {/* Logo Mark */}

            <div
              className="
                w-9
                h-9

                flex
                items-center
                justify-center

                rounded-xl

                bg-[#0f766e]
                text-white

                font-bold
                text-[16px]

                shadow-sm
              "
            >
              S
            </div>

            {/* Logo Text */}

            <div>
              <div
                className="
                  flex
                  items-center
                  gap-1
                  leading-none
                "
              >
                <span
                  className="
                    text-[18px]
                    font-bold
                    tracking-[-0.4px]
                    text-[#163b38]
                  "
                >
                  SkillBridge
                </span>

                <span
                  className="
                    text-[18px]
                    font-bold
                    text-[#0f766e]
                  "
                >
                  AI
                </span>
              </div>

              <p
                className="
                  m-0
                  mt-1
                  text-[10px]
                  font-medium
                  text-[#91a09d]
                "
              >
                Placement Preparation
              </p>
            </div>
          </Link>

          {/* Mobile Close */}

          <button
            type="button"
            onClick={() =>
              setOpen(false)
            }
            aria-label="Close navigation"
            className="
              lg:hidden

              w-8
              h-8

              flex
              items-center
              justify-center

              rounded-lg

              text-[#71817e]

              hover:bg-[#f3f8f6]

              transition-colors
            "
          >
            <Icon type="close" />
          </button>
        </div>

        {/* ==================================
            NAVIGATION
        ================================== */}

        <nav
          className="
            flex-1
            overflow-y-auto
            px-4
            py-4
          "
        >
          <SectionTitle>
            Main
          </SectionTitle>

          <div className="space-y-1">
            {mainMenu.map(
              renderMenuItem
            )}
          </div>

          <SectionTitle>
            Preparation
          </SectionTitle>

          <div className="space-y-1">
            {preparationMenu.map(
              renderMenuItem
            )}
          </div>

          <SectionTitle>
            Account
          </SectionTitle>

          <div className="space-y-1">
            {accountMenu.map(
              renderMenuItem
            )}
          </div>
        </nav>

        {/* ==================================
            BOTTOM AREA
        ================================== */}

        <div
          className="
            p-4
            border-t
            border-[#edf2f0]
          "
        >
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="
              w-full
              min-h-[44px]

              flex
              items-center
              gap-3

              px-3

              rounded-xl

              bg-transparent

              text-[14px]
              font-medium
              text-[#71817e]

              transition-all
              duration-200

              hover:bg-[#fff3f2]
              hover:text-[#c75252]

              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <Icon type="logout" />

            <span>
              {loggingOut
                ? "Logging out..."
                : "Logout"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;