import { Link } from "react-router-dom";

const NotFoundIcon = ({ size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
      <path d="M9 16c.8-1 1.8-1.5 3-1.5s2.2.5 3 1.5" />
    </svg>
  );
};

function NotFound() {
  return (
    <main
      className="
        min-h-screen
        bg-[#f4f8f6]

        flex
        items-center
        justify-center

        px-5
        py-10

        relative
        overflow-hidden
      "
    >
      {/* Background decoration */}

      <div
        className="
          absolute
          -top-32
          -left-32

          w-[380px]
          h-[380px]

          rounded-full
          bg-[#dcefe8]

          opacity-70
          blur-3xl

          pointer-events-none
        "
      />

      <div
        className="
          absolute
          -bottom-36
          -right-32

          w-[400px]
          h-[400px]

          rounded-full
          bg-[#e5f3ee]

          opacity-80
          blur-3xl

          pointer-events-none
        "
      />

      {/* 404 Card */}

      <section
        className="
          relative
          z-10

          w-full
          max-w-[520px]

          bg-white

          border
          border-[#e2ebe7]

          rounded-[24px]

          px-6
          sm:px-10

          py-10
          sm:py-12

          text-center

          shadow-[0_20px_60px_rgba(31,73,65,0.07)]
        "
      >
        {/* Icon */}

        <div
          className="
            w-14
            h-14

            mx-auto

            rounded-2xl

            bg-[#e8f5f1]
            text-[#0f766e]

            flex
            items-center
            justify-center
          "
        >
          <NotFoundIcon size={25} />
        </div>

        {/* 404 */}

        <p
          className="
            m-0
            mt-6

            text-[11px]
            font-bold
            uppercase
            tracking-[0.14em]

            text-[#0f766e]
          "
        >
          Error 404
        </p>

        {/* Heading */}

        <h1
          className="
            m-0
            mt-3

            text-[28px]
            sm:text-[34px]

            font-bold
            tracking-[-1px]

            text-[#102a2a]
          "
        >
          Page not found
        </h1>

        {/* Description */}

        <p
          className="
            m-0
            mt-3

            max-w-[360px]
            mx-auto

            text-[10px]
            sm:text-[11px]

            leading-5

            text-[#71817e]
          "
        >
          The page you are looking for
          doesn't exist or may have been
          moved.
        </p>

        {/* Home Button */}

        <Link
          to="/"
          className="
            inline-flex
            items-center
            justify-center
            gap-2

            mt-7

            h-11
            px-5

            rounded-[11px]

            bg-[#0f766e]
            text-white

            text-[9px]
            font-semibold

            hover:bg-[#0b5f59]
            hover:-translate-y-[1px]

            transition-all
            duration-200
          "
        >
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
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>

          Back to Home
        </Link>

        {/* Brand */}

        <div
          className="
            mt-8
            pt-5

            border-t
            border-[#edf2f0]

            text-[8px]
            text-[#a1afac]
          "
        >
          SkillBridge AI · Placement Preparation
        </div>
      </section>
    </main>
  );
}

export default NotFound;