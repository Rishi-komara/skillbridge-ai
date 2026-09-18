import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const LoginIcon = ({ type, size = 20 }) => {
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
    logo: (
      <>
        <path d="M4 19V9" />
        <path d="M10 19V5" />
        <path d="M16 19v-7" />
        <path d="M22 19V3" />
      </>
    ),

    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),

    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),

    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),

    eyeOff: (
      <>
        <path d="m3 3 18 18" />
        <path d="M10.6 6.2A9.6 9.6 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-2.1 2.8" />
        <path d="M6.6 6.7C3.6 8.5 2 12 2 12s3.5 6 10 6c1.4 0 2.6-.3 3.7-.7" />
      </>
    ),

    arrow: (
      <>
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
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

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);

      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        setError("Invalid email or password.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/too-many-requests") {
        setError(
          "Too many failed login attempts. Please try again later."
        );
      } else if (err.code === "auth/network-request-failed") {
        setError(
          "Network error. Please check your internet connection."
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to login. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="
        min-h-screen
        bg-[#f4f8f6]
        flex
        items-center
        justify-center
        px-5
        py-8
        relative
        overflow-hidden
      "
    >
      {/* BACKGROUND */}

      <div
        className="
          absolute
          -top-32
          -left-32
          w-[360px]
          h-[360px]
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
          -bottom-40
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

      {/* AUTH CONTAINER */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-[980px]
          bg-white
          border
          border-[#e2ebe7]
          rounded-[26px]
          shadow-[0_24px_70px_rgba(31,73,65,0.08)]
          overflow-hidden
          grid
          lg:grid-cols-[0.9fr_1.1fr]
        "
      >
        {/* LEFT SIDE */}

        <section
          className="
            hidden
            lg:flex
            relative
            overflow-hidden
            bg-[#e8f5f1]
            px-10
            py-10
            flex-col
            justify-between
            min-h-[600px]
          "
        >
          <div
            className="
              absolute
              -right-20
              -top-20
              w-64
              h-64
              rounded-full
              bg-[#d4ebe3]
            "
          />

          <div className="relative z-10">
            {/* LOGO */}

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
                  w-9
                  h-9
                  rounded-[10px]
                  bg-[#0f766e]
                  text-white
                  flex
                  items-center
                  justify-center
                "
              >
                <LoginIcon type="logo" size={17} />
              </div>

              <span
                className="
                  text-[17px]
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
              </span>
            </Link>

            {/* TEXT */}

            <div className="mt-20">
              <p
                className="
                  m-0
                  text-[13px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-[#0f766e]
                "
              >
                Placement Preparation
              </p>

              <h1
                className="
                  m-0
                  mt-4
                  max-w-[350px]
                  text-[32px]
                  leading-[1.2]
                  font-bold
                  tracking-[-1px]
                  text-[#102a2a]
                "
              >
                Continue building your
                placement readiness.
              </h1>

              <p
                className="
                  m-0
                  mt-4
                  max-w-[340px]
                  text-[14px]
                  leading-6
                  text-[#647875]
                "
              >
                Sign in to continue your
                resume analysis, skill-gap
                preparation, roadmap and
                interview practice.
              </p>
            </div>
          </div>

          {/* WORKFLOW */}

          <div
            className="
              relative
              z-10
              space-y-3
            "
          >
            {[
              "Analyze your resume",
              "Identify skill gaps",
              "Follow your preparation plan",
            ].map((item) => (
              <div
                key={item}
                className="
                  flex
                  items-center
                  gap-2.5
                  text-[14px]
                  font-medium
                  text-[#466560]
                "
              >
                <span className="text-[#0f766e]">
                  <LoginIcon
                    type="check"
                    size={16}
                  />
                </span>

                {item}
              </div>
            ))}
          </div>
        </section>

        {/* LOGIN FORM SIDE */}

        <section
          className="
            px-6
            sm:px-10
            lg:px-14
            py-8
            sm:py-10
            lg:py-12
            flex
            flex-col
            justify-center
          "
        >
          {/* BACK */}

          <Link
            to="/"
            className="
              w-fit
              inline-flex
              items-center
              gap-2
              text-[13px]
              font-semibold
              text-[#71817e]
              hover:text-[#0f766e]
              transition-colors
            "
          >
            <LoginIcon
              type="arrow"
              size={15}
            />

            Back to home
          </Link>

          {/* MOBILE LOGO */}

          <Link
            to="/"
            className="
              lg:hidden
              mt-8
              inline-flex
              items-center
              gap-2.5
              w-fit
              no-underline
            "
          >
            <div
              className="
                w-9
                h-9
                rounded-[10px]
                bg-[#0f766e]
                text-white
                flex
                items-center
                justify-center
              "
            >
              <LoginIcon
                type="logo"
                size={17}
              />
            </div>

            <span
              className="
                text-[17px]
                font-bold
                text-[#163b38]
              "
            >
              SkillBridge
              <span className="text-[#0f766e]">
                {" "}
                AI
              </span>
            </span>
          </Link>

          {/* HEADING */}

          <div className="mt-10 lg:mt-14">
            <h2
              className="
                m-0
                text-[27px]
                sm:text-[30px]
                font-bold
                tracking-[-0.8px]
                text-[#102a2a]
              "
            >
              Welcome back
            </h2>

            <p
              className="
                m-0
                mt-2
                text-[14px]
                leading-6
                text-[#71817e]
              "
            >
              Enter your account details
              to continue your preparation.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div
              role="alert"
              className="
                mt-6
                px-3.5
                py-3
                rounded-[12px]
                border
                border-[#f3cece]
                bg-[#fff5f5]
                text-[13px]
                leading-5
                text-[#b54747]
              "
            >
              {error}
            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={handleLogin}
            className="mt-7"
          >
            {/* EMAIL */}

            <div>
              <label
                htmlFor="login-email"
                className="
                  block
                  mb-2
                  text-[13px]
                  font-semibold
                  text-[#405b57]
                "
              >
                Email address
              </label>

              <div className="relative">
                <span
                  className="
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-[#8fa19d]
                    pointer-events-none
                  "
                >
                  <LoginIcon
                    type="mail"
                    size={17}
                  />
                </span>

                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                  disabled={loading}
                  autoComplete="email"
                  className="
                    w-full
                    h-12
                    pl-10
                    pr-4
                    rounded-[12px]
                    bg-[#f8fbf9]
                    border
                    border-[#dce8e3]
                    outline-none
                    text-[14px]
                    text-[#163b38]
                    placeholder:text-[#a3b0ad]
                    focus:border-[#8fc1b4]
                    focus:ring-2
                    focus:ring-[#0f766e]/5
                    disabled:opacity-60
                    transition-all
                  "
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="mt-5">
              <label
                htmlFor="login-password"
                className="
                  block
                  mb-2
                  text-[13px]
                  font-semibold
                  text-[#405b57]
                "
              >
                Password
              </label>

              <div className="relative">
                <span
                  className="
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-[#8fa19d]
                    pointer-events-none
                  "
                >
                  <LoginIcon
                    type="lock"
                    size={17}
                  />
                </span>

                <input
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  className="
                    w-full
                    h-12
                    pl-10
                    pr-12
                    rounded-[12px]
                    bg-[#f8fbf9]
                    border
                    border-[#dce8e3]
                    outline-none
                    text-[14px]
                    text-[#163b38]
                    placeholder:text-[#a3b0ad]
                    focus:border-[#8fc1b4]
                    focus:ring-2
                    focus:ring-[#0f766e]/5
                    disabled:opacity-60
                    transition-all
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="
                    absolute
                    right-3.5
                    top-1/2
                    -translate-y-1/2
                    text-[#829591]
                    hover:text-[#0f766e]
                    disabled:opacity-50
                    transition-colors
                  "
                >
                  <LoginIcon
                    type={
                      showPassword
                        ? "eyeOff"
                        : "eye"
                    }
                    size={18}
                  />
                </button>
              </div>
            </div>

            {/* SIGN IN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-12
                mt-7
                rounded-[12px]
                bg-[#0f766e]
                text-white
                flex
                items-center
                justify-center
                gap-2
                text-[14px]
                font-semibold
                hover:bg-[#0b5f59]
                hover:-translate-y-[1px]
                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:translate-y-0
                transition-all
                duration-200
              "
            >
              {loading && (
                <span
                  className="
                    w-4
                    h-4
                    rounded-full
                    border-2
                    border-white/40
                    border-t-white
                    animate-spin
                  "
                />
              )}

              {loading
                ? "Signing in..."
                : "Sign in"}
            </button>
          </form>

          {/* SIGNUP */}

          <p
            className="
              m-0
              mt-6
              text-center
              text-[13px]
              text-[#71817e]
            "
          >
            Don't have an account?

            <Link
              to="/signup"
              className="
                ml-1.5
                font-semibold
                text-[14px]
                text-[#0f766e]
                hover:text-[#0b5f59]
                transition-colors
              "
            >
              Create account
            </Link>
          </p>

          {/* SECURITY NOTE */}

          <p
            className="
              m-0
              mt-8
              text-center
              text-[11px]
              leading-5
              text-[#a1afac]
            "
          >
            Sign in securely to access your
            SkillBridge account.
          </p>
        </section>
      </div>
    </main>
  );
}

export default Login;