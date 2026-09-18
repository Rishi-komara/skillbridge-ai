import { Link } from "react-router-dom";
import { useState } from "react";

function DashboardTopbar() {
  const [showNotifications, setShowNotifications] =
    useState(false);

  return (
    <header
      className="
        relative
        flex
        items-center
        justify-between
        gap-6

        mb-7

        bg-white
        border
        border-[#e2ebe7]

        rounded-[18px]

        px-6
        py-4

        shadow-[0_1px_3px_rgba(15,118,110,0.04)]
      "
    >
      {/* =====================================
          LEFT
      ===================================== */}

      <div className="min-w-0">
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <h2
            className="
              m-0
              text-[20px]
              sm:text-[22px]
              font-semibold
              tracking-[-0.4px]
              text-[#163b38]
            "
          >
            Welcome back
          </h2>

          <span
            className="
              hidden
              sm:inline
              text-[20px]
            "
          >
            👋
          </span>
        </div>

        <p
          className="
            m-0
            mt-1
            text-[13px]
            sm:text-[14px]
            text-[#71817e]
          "
        >
          Continue your placement preparation.
        </p>
      </div>

      {/* =====================================
          RIGHT
      ===================================== */}

      <div
        className="
          flex
          items-center
          gap-2
          sm:gap-3
          relative
        "
      >
        {/* =================================
            NOTIFICATION BUTTON
        ================================= */}

        <button
          type="button"
          onClick={() =>
            setShowNotifications(
              (previous) => !previous
            )
          }
          aria-label="Notifications"
          className="
            relative

            w-10
            h-10

            flex
            items-center
            justify-center

            bg-[#f8fbfa]
            text-[#667775]

            border
            border-[#e2ebe7]

            rounded-xl

            transition-all
            duration-200

            hover:bg-[#e8f5f1]
            hover:text-[#0f766e]
            hover:border-[#cfe2dc]
          "
        >
          {/* Bell Icon */}

          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
          </svg>
        </button>

        {/* =================================
            NOTIFICATION DROPDOWN
        ================================= */}

        {showNotifications && (
          <div
            className="
              absolute
              top-[52px]
              right-0

              z-50

              w-[290px]
              sm:w-[320px]

              bg-white

              border
              border-[#e2ebe7]

              rounded-2xl

              shadow-[0_16px_40px_rgba(27,67,60,0.12)]

              overflow-hidden

              sb-fade-in
            "
          >
            {/* Header */}

            <div
              className="
                px-5
                py-4

                border-b
                border-[#edf2f0]
              "
            >
              <h3
                className="
                  m-0
                  text-[15px]
                  font-semibold
                  text-[#163b38]
                "
              >
                Notifications
              </h3>
            </div>

            {/* Empty State */}

            <div
              className="
                px-5
                py-8

                flex
                flex-col
                items-center
                text-center
              "
            >
              <div
                className="
                  w-10
                  h-10

                  flex
                  items-center
                  justify-center

                  mb-3

                  rounded-xl

                  bg-[#e8f5f1]
                  text-[#0f766e]
                "
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                  <path d="M10 21h4" />
                </svg>
              </div>

              <p
                className="
                  m-0
                  text-[13px]
                  font-medium
                  text-[#526562]
                "
              >
                No new notifications
              </p>

              <p
                className="
                  m-0
                  mt-1
                  text-[12px]
                  text-[#91a09d]
                "
              >
                Your latest updates will appear here.
              </p>
            </div>
          </div>
        )}

        {/* =================================
            PROFILE
        ================================= */}

        <Link
          to="/profile"
          className="
            flex
            items-center
            gap-2.5

            min-h-[42px]

            pl-1.5
            pr-3

            bg-white

            border
            border-[#e2ebe7]

            rounded-xl

            transition-all
            duration-200

            hover:bg-[#f8fbfa]
            hover:border-[#cfe2dc]
          "
        >
          {/* Avatar */}

          <div
            className="
              w-8
              h-8

              flex
              items-center
              justify-center

              rounded-lg

              bg-[#0f766e]

              text-white
              text-[13px]
              font-semibold
            "
          >
            R
          </div>

          {/* Profile text */}

          <div
            className="
              hidden
              sm:block
              leading-tight
            "
          >
            <p
              className="
                m-0
                text-[12px]
                font-semibold
                text-[#163b38]
              "
            >
              Profile
            </p>

            <p
              className="
                m-0
                mt-[2px]
                text-[10px]
                text-[#91a09d]
              "
            >
              View account
            </p>
          </div>

          {/* Arrow */}

          <svg
            className="
              hidden
              sm:block
              text-[#91a09d]
            "
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>
    </header>
  );
}

export default DashboardTopbar;