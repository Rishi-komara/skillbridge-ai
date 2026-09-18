function Toast({
  message,
  type = "success",
  show,
}) {
  if (!show) return null;

  const isSuccess = type === "success";

  return (
    <div
      role="status"
      className={`
        fixed
        top-5
        right-5
        z-[100]

        max-w-[360px]

        flex
        items-center
        gap-3

        px-4
        py-3

        rounded-xl

        border

        shadow-[0_12px_35px_rgba(31,73,65,0.12)]

        ${
          isSuccess
            ? "bg-white border-[#cfe5dc] text-[#245c50]"
            : "bg-white border-[#f0cccc] text-[#a33f3f]"
        }
      `}
    >
      {/* Icon */}
      <div
        className={`
          w-7
          h-7

          shrink-0

          rounded-lg

          flex
          items-center
          justify-center

          ${
            isSuccess
              ? "bg-[#e8f5f1] text-[#0f766e]"
              : "bg-[#fff1f1] text-[#c45151]"
          }
        `}
      >
        {isSuccess ? (
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
            <path d="m5 12 4 4L19 6" />
          </svg>
        ) : (
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
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5" />
            <path d="M12 17h.01" />
          </svg>
        )}
      </div>

      {/* Message */}
      <p
        className="
          m-0

          text-[10px]
          font-medium
          leading-5
        "
      >
        {message}
      </p>
    </div>
  );
}

export default Toast;