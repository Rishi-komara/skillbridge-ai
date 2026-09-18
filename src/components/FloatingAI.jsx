import { useEffect, useRef, useState } from "react";
import { chatWithAI } from "../services/aiService";

const AIIcon = ({ type, size = 20 }) => {
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
    spark: (
      <>
        <path d="M12 3l1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3z" />
        <path d="M18.5 14l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3z" />
        <path d="M5.5 13l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6.6-1.9z" />
      </>
    ),

    close: (
      <>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </>
    ),

    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4 20-7z" />
        <path d="M22 2 11 13" />
      </>
    ),

    bot: (
      <>
        <rect x="4" y="7" width="16" height="12" rx="3" />
        <path d="M12 3v4" />
        <path d="M9 12h.01" />
        <path d="M15 12h.01" />
        <path d="M9 16h6" />
      </>
    ),
  };

  return <svg {...common}>{icons[type]}</svg>;
};

function FloatingAI() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! Ask me about placements, resumes, DSA, interviews or career preparation.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Automatically scroll to the latest message.
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, loading, open]);

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) return;

    const userMessage = {
      sender: "user",
      text: trimmedMessage,
    };

    const nextMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(nextMessages);
    setMessage("");
    setLoading(true);

    try {
      const response = await chatWithAI(
        trimmedMessage
      );

      const aiReply = {
        sender: "ai",
        text:
          response.data?.response ||
          "I couldn't generate a response right now.",
      };

      setMessages([
        ...nextMessages,
        aiReply,
      ]);
    } catch (error) {
      const aiReply = {
        sender: "ai",
        text:
          error.response?.data?.message ||
          "Sorry, I couldn't respond right now.",
      };

      setMessages([
        ...nextMessages,
        aiReply,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    "Give me a DSA roadmap",
    "How can I improve my resume?",
  ];

  return (
    <div
      className="
        fixed
        bottom-5
        right-5
        sm:bottom-7
        sm:right-7

        z-50

        flex
        flex-col
        items-end
      "
    >
      {/* =================================
          CHAT WINDOW
      ================================= */}

      {open && (
        <div
          className="
            w-[calc(100vw-40px)]
            sm:w-[370px]

            h-[520px]
            max-h-[calc(100vh-110px)]

            mb-3

            bg-white

            border
            border-[#dce8e3]

            rounded-[22px]

            shadow-[0_24px_70px_rgba(24,62,55,0.16)]

            overflow-hidden

            flex
            flex-col
          "
        >
          {/* HEADER */}

          <div
            className="
              px-4
              py-3.5

              border-b
              border-[#edf2f0]

              flex
              items-center
              justify-between

              bg-white
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  w-9
                  h-9

                  rounded-xl

                  bg-[#e8f5f1]
                  text-[#0f766e]

                  flex
                  items-center
                  justify-center
                "
              >
                <AIIcon
                  type="spark"
                  size={18}
                />
              </div>

              <div>
                <h3
                  className="
                    m-0

                    text-[16px]
                    font-semibold
                    text-[#163b38]
                  "
                >
                  SkillBridge AI
                </h3>

                <div
                  className="
                    mt-0.5

                    flex
                    items-center
                    gap-1.5

                    text-[12px]
                    text-[#71817e]
                  "
                >
                  <span
                    className="
                      w-1.5
                      h-1.5

                      rounded-full

                      bg-[#4caf50]
                    "
                  />

                  Career preparation assistant
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close AI assistant"
              className="
                w-8
                h-8

                rounded-lg

                flex
                items-center
                justify-center

                text-[#71817e]

                hover:bg-[#f4f8f6]
                hover:text-[#163b38]

                transition-colors
              "
            >
              <AIIcon
                type="close"
                size={17}
              />
            </button>
          </div>

          {/* =================================
              MESSAGES
          ================================= */}

          <div
            className="
              flex-1

              overflow-y-auto

              px-4
              py-4

              bg-[#f8fbf9]

              space-y-3
            "
          >
            {messages.map(
              (item, index) => (
                <div
                  key={index}
                  className={
                    item.sender === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                >
                  <div
                    className={`
                      max-w-[82%]

                      px-3.5
                      py-2.5

                      rounded-[14px]

                      text-[14px]
                      leading-5

                      whitespace-pre-wrap
                      break-words

                      ${
                        item.sender ===
                        "user"
                          ? `
                            bg-[#0f766e]
                            text-white
                            rounded-br-[5px]
                          `
                          : `
                            bg-white
                            text-[#405b57]

                            border
                            border-[#e2ebe7]

                            rounded-bl-[5px]
                          `
                      }
                    `}
                  >
                    {item.text}
                  </div>
                </div>
              )
            )}

            {/* LOADING */}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="
                    bg-white

                    border
                    border-[#e2ebe7]

                    rounded-[14px]
                    rounded-bl-[5px]

                    px-4
                    py-3

                    flex
                    items-center
                    gap-1
                  "
                >
                  <span
                    className="
                      w-1.5
                      h-1.5
                      rounded-full
                      bg-[#7aa99e]
                      animate-bounce
                    "
                  />

                  <span
                    className="
                      w-1.5
                      h-1.5
                      rounded-full
                      bg-[#7aa99e]
                      animate-bounce
                      [animation-delay:120ms]
                    "
                  />

                  <span
                    className="
                      w-1.5
                      h-1.5
                      rounded-full
                      bg-[#7aa99e]
                      animate-bounce
                      [animation-delay:240ms]
                    "
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* =================================
              QUICK QUESTIONS
          ================================= */}

          <div
            className="
              px-4
              pt-3

              bg-white

              border-t
              border-[#edf2f0]
            "
          >
            <p
              className="
                m-0
                mb-2

                text-[12px]
                font-semibold
                uppercase
                tracking-[0.08em]

                text-[#9aa8a5]
              "
            >
              Quick questions
            </p>

            <div
              className="
                flex
                gap-2

                overflow-x-auto
                pb-1
              "
            >
              {suggestions.map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() =>
                      setMessage(
                        suggestion
                      )
                    }
                    disabled={loading}
                    className="
                      shrink-0

                      px-3
                      py-1.5

                      rounded-full

                      bg-[#e8f5f1]

                      border
                      border-[#d8e9e2]

                      text-[12px]
                      font-medium
                      text-[#0f766e]

                      hover:bg-[#dcefe8]

                      disabled:opacity-50

                      transition-colors
                    "
                  >
                    {suggestion}
                  </button>
                )
              )}
            </div>
          </div>

          {/* =================================
              INPUT
          ================================= */}

          <div
            className="
              p-4
              pt-3

              bg-white
            "
          >
            <div
              className="
                flex
                items-end
                gap-2

                p-1.5

                rounded-[14px]

                border
                border-[#dce8e3]

                bg-[#f8fbf9]

                focus-within:border-[#9dc9bc]
                focus-within:ring-2
                focus-within:ring-[#0f766e]/5

                transition-all
              "
            >
              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                disabled={loading}
                rows={1}
                placeholder="Ask about placements..."
                className="
                  flex-1

                  min-h-[38px]
                  max-h-[90px]

                  resize-none

                  bg-transparent

                  border-0
                  outline-none

                  px-2.5
                  py-2

                  text-[14px]
                  leading-5
                  text-[#163b38]

                  placeholder:text-[#9caaa7]

                  disabled:opacity-60
                "
              />

              <button
                type="button"
                onClick={handleSend}
                disabled={
                  loading ||
                  !message.trim()
                }
                aria-label="Send message"
                className="
                  shrink-0

                  w-9
                  h-9

                  rounded-[10px]

                  bg-[#0f766e]
                  text-white

                  flex
                  items-center
                  justify-center

                  hover:bg-[#0b5f59]

                  disabled:opacity-40
                  disabled:cursor-not-allowed

                  transition-colors
                "
              >
                <AIIcon
                  type="send"
                  size={15}
                />
              </button>
            </div>

            <p
              className="
                m-0
                mt-2

                text-center

                text-[12px]
                text-[#a1afac]
              "
            >
              AI responses may need verification.
            </p>
          </div>
        </div>
      )}

      {/* =================================
          FLOATING BUTTON
      ================================= */}

      <button
        type="button"
        onClick={() =>
          setOpen((previous) => !previous)
        }
        aria-label={
          open
            ? "Close AI assistant"
            : "Open AI assistant"
        }
        className="
          h-12

          px-4

          rounded-full

          bg-[#0f766e]
          text-white

          shadow-[0_10px_30px_rgba(15,118,110,0.25)]

          flex
          items-center
          gap-2

          hover:bg-[#0b5f59]
          hover:-translate-y-[1px]

          transition-all
          duration-200
        "
      >
        {open ? (
          <>
            <AIIcon
              type="close"
              size={17}
            />

            <span
              className="
                text-[13px]
                font-semibold
              "
            >
              Close
            </span>
          </>
        ) : (
          <>
            <AIIcon
              type="bot"
              size={18}
            />

            <span
              className="
                text-[13px]
                font-semibold
              "
            >
              Ask AI
            </span>
          </>
        )}
      </button>
    </div>
  );
}

export default FloatingAI;