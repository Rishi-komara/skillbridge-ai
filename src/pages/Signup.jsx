import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SignupIcon = ({ type, size = 20 }) => {
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

    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
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

function Signup() {
  const navigate = useNavigate();

  const { signup, logout } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill all fields");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, name);

      // Keep required flow:
      // Signup -> Login -> Dashboard
      await logout();

      setSuccess(
        "Account created successfully! Redirecting to Sign In..."
      );

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Signup Error:", err);

      if (
        err.code === "auth/email-already-in-use"
      ) {
        setError(
          "An account with this email already exists. Please login."
        );
      } else if (
        err.code === "auth/invalid-email"
      ) {
        setError(
          "Please enter a valid email address."
        );
      } else if (
        err.code === "auth/weak-password"
      ) {
        setError(
          "Please choose a stronger password."
        );
      } else if (
        err.code === "auth/network-request-failed"
      ) {
        setError(
          "Network error. Please check your internet connection."
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to create account. Please try again."
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
          max-w-[1020px]
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
        {/* LEFT PANEL */}

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
            min-h-[650px]
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
                <SignupIcon
                  type="logo"
                  size={17}
                />
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

            {/* INTRO */}

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
                Start Preparing
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
                Build a more structured
                placement preparation
                journey.
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
                Create your SkillBridge
                account to access resume
                analysis, skill-gap
                preparation, roadmaps and
                interview practice.
              </p>
            </div>
          </div>

          {/* BENEFITS */}

          <div
            className="
              relative
              z-10
              space-y-3
            "
          >
            {[
              "Analyze your resume",
              "Understand role-based skill gaps",
              "Build and track your preparation",
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
                  <SignupIcon
                    type="check"
                    size={16}
                  />
                </span>

                {item}
              </div>
            ))}
          </div>
        </section>

        {/* SIGNUP FORM */}

        <section
          className="
            px-6
            sm:px-10
            lg:px-14
            py-8
            sm:py-10
            flex
            flex-col
            justify-center
          "
        >
          {/* BACK HOME */}

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
            <SignupIcon
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
              mt-7
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
              <SignupIcon
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

          <div className="mt-8 lg:mt-10">
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
              Create your account
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
              Enter your details to get
              started with SkillBridge.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div
              role="alert"
              className="
                mt-5
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

          {/* SUCCESS */}

          {success && (
            <div
              role="status"
              className="
                mt-5
                px-3.5
                py-3
                rounded-[12px]
                border
                border-[#cde7d7]
                bg-[#f1faf4]
                flex
                items-start
                gap-2
                text-[13px]
                leading-5
                text-[#287347]
              "
            >
              <span className="shrink-0 mt-[1px]">
                <SignupIcon
                  type="check"
                  size={15}
                />
              </span>

              {success}
            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={handleSignup}
            className="mt-6"
          >
            {/* FULL NAME */}

            <div>
              <label
                htmlFor="signup-name"
                className="
                  block
                  mb-2
                  text-[13px]
                  font-semibold
                  text-[#405b57]
                "
              >
                Full name
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
                  <SignupIcon
                    type="user"
                    size={17}
                  />
                </span>

                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  required
                  disabled={loading || !!success}
                  autoComplete="name"
                  className="
                    w-full
                    h-11
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

            {/* EMAIL */}

            <div className="mt-4">
              <label
                htmlFor="signup-email"
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
                  <SignupIcon
                    type="mail"
                    size={17}
                  />
                </span>

                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  required
                  disabled={loading || !!success}
                  autoComplete="email"
                  className="
                    w-full
                    h-11
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

            <div className="mt-4">
              <label
                htmlFor="signup-password"
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
                  <SignupIcon
                    type="lock"
                    size={17}
                  />
                </span>

                <input
                  id="signup-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Minimum 8 characters"
                  required
                  disabled={loading || !!success}
                  autoComplete="new-password"
                  className="
                    w-full
                    h-11
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
                  disabled={loading || !!success}
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
                  <SignupIcon
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

            {/* CONFIRM PASSWORD */}

            <div className="mt-4">
              <label
                htmlFor="signup-confirm-password"
                className="
                  block
                  mb-2
                  text-[13px]
                  font-semibold
                  text-[#405b57]
                "
              >
                Confirm password
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
                  <SignupIcon
                    type="lock"
                    size={17}
                  />
                </span>

                <input
                  id="signup-confirm-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Re-enter your password"
                  required
                  disabled={loading || !!success}
                  autoComplete="new-password"
                  className="
                    w-full
                    h-11
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

            {/* PASSWORD INFO */}

            <p
              className="
                m-0
                mt-2
                text-[12px]
                leading-5
                text-[#91a09d]
              "
            >
              Use at least 8 characters for
              your password.
            </p>

            {/* SIGNUP BUTTON */}

            <button
              type="submit"
              disabled={loading || !!success}
              className="
                w-full
                h-12
                mt-5
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
                ? "Creating account..."
                : success
                ? "Account created"
                : "Create account"}
            </button>
          </form>

          {/* LOGIN LINK */}

          <p
            className="
              m-0
              mt-5
              text-center
              text-[13px]
              text-[#71817e]
            "
          >
            Already have an account?

            <Link
              to="/login"
              className="
                ml-1.5
                text-[14px]
                font-semibold
                text-[#0f766e]
                hover:text-[#0b5f59]
                transition-colors
              "
            >
              Sign in
            </Link>
          </p>

          {/* SECURITY NOTE */}

          <p
            className="
              m-0
              mt-6
              text-center
              text-[11px]
              leading-5
              text-[#a1afac]
            "
          >
            Create your account to access
            SkillBridge placement preparation tools.
          </p>
        </section>
      </div>
    </main>
  );
}

export default Signup;