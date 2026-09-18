function Loader() {
  return (
    <div
      className="
        min-h-screen
        bg-[#f4f8f6]

        flex
        flex-col
        items-center
        justify-center

        gap-4
      "
    >
      {/* Brand Icon */}
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
        "
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19V9" />
          <path d="M10 19V5" />
          <path d="M16 19v-7" />
          <path d="M22 19V3" />
        </svg>
      </div>

      {/* Spinner */}
      <div
        className="
          w-7
          h-7

          rounded-full

          border-[3px]
          border-[#d7e8e2]
          border-t-[#0f766e]

          animate-spin
        "
        role="status"
        aria-label="Loading"
      />

      {/* Text */}
      <p
        className="
          m-0

          text-[9px]
          font-medium
          tracking-[0.02em]

          text-[#71817e]
        "
      >
        Loading SkillBridge...
      </p>
    </div>
  );
}

export default Loader;