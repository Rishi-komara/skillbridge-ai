import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import { useAuth } from "../hooks/useAuth";

// ==========================================
// ICONS
// ==========================================

const ProfileIcon = ({ type, size = 20 }) => {
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
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),

    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5z" />
      </>
    ),

    save: (
      <>
        <path d="M5 3h12l2 2v16H5V3z" />
        <path d="M8 3v6h8V3" />
        <path d="M8 21v-7h8v7" />
      </>
    ),

    close: (
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6 6 18" />
      </>
    ),

    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),

    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V4h8v3" />
        <path d="M3 12h18" />
      </>
    ),

    skills: (
      <>
        <path d="M12 3v3" />
        <path d="M12 18v3" />
        <path d="M3 12h3" />
        <path d="M18 12h3" />
        <circle cx="12" cy="12" r="5" />
      </>
    ),

    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5" />
        <path d="M12 8h.01" />
      </>
    ),
  };

  return <svg {...common}>{icons[type]}</svg>;
};

// ==========================================
// EMPTY PROFILE
// ==========================================

const createEmptyProfile = () => ({
  name: "",
  role: "",
  email: "",
  skills: "",
});

// ==========================================
// PROFILE PAGE
// ==========================================

function Profile() {
  const { currentUser } = useAuth();

  const [editing, setEditing] = useState(false);

  const [savedProfile, setSavedProfile] = useState(
    createEmptyProfile()
  );

  const [profile, setProfile] = useState(
    createEmptyProfile()
  );

  const [savedMessage, setSavedMessage] =
    useState(false);

  const [profileLoaded, setProfileLoaded] =
    useState(false);

  // ==========================================
  // USER-SPECIFIC STORAGE KEY
  // ==========================================

  const storageKey = currentUser?.uid
    ? `skillbridge-profile-${currentUser.uid}`
    : null;

  // ==========================================
  // LOAD PROFILE FOR CURRENT USER
  // ==========================================

  useEffect(() => {
    if (!storageKey) {
      setProfileLoaded(false);
      return;
    }

    const emptyProfile = createEmptyProfile();

    try {
      const saved = localStorage.getItem(storageKey);

      if (saved) {
        const parsed = JSON.parse(saved);

        const cleanedSavedProfile = {
          name:
            typeof parsed?.name === "string"
              ? parsed.name
              : "",

          role:
            typeof parsed?.role === "string"
              ? parsed.role
              : "",

          email:
            typeof parsed?.email === "string"
              ? parsed.email
              : "",

          skills:
            typeof parsed?.skills === "string"
              ? parsed.skills
              : "",
        };

        setProfile(cleanedSavedProfile);
        setSavedProfile(cleanedSavedProfile);
      } else {
        setProfile(emptyProfile);
        setSavedProfile(emptyProfile);
      }
    } catch (error) {
      console.error(
        "Failed to load saved profile:",
        error
      );

      setProfile(emptyProfile);
      setSavedProfile(emptyProfile);
    }

    setEditing(false);
    setSavedMessage(false);
    setProfileLoaded(true);
  }, [storageKey]);

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const saveProfile = () => {
    if (!storageKey) return;

    const cleanedProfile = {
      name: profile.name.trim(),
      role: profile.role.trim(),
      email: profile.email.trim(),
      skills: profile.skills.trim(),
    };

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(cleanedProfile)
      );

      setProfile(cleanedProfile);
      setSavedProfile(cleanedProfile);

      setEditing(false);
      setSavedMessage(true);

      window.setTimeout(() => {
        setSavedMessage(false);
      }, 2500);
    } catch (error) {
      console.error(
        "Failed to save profile:",
        error
      );
    }
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const cancelEdit = () => {
    setProfile(savedProfile);
    setEditing(false);
  };

  // ==========================================
  // SKILLS
  // ==========================================

  const skills =
    savedProfile.skills
      ?.split(",")
      .map((skill) => skill.trim())
      .filter(Boolean) || [];

  // ==========================================
  // INITIALS
  // ==========================================

  const initials =
    savedProfile.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "U";

  // ==========================================
  // LOADING
  // ==========================================

  if (!profileLoaded) {
    return (
      <PageLayout
        title="My Profile"
        subtitle="Manage your personal and career preparation details."
      >
        <div className="sb-card p-6">
          <p className="m-0 text-[14px] text-[#71817e]">
            Loading profile...
          </p>
        </div>
      </PageLayout>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <PageLayout
      title="My Profile"
      subtitle="Manage your personal and career preparation details."
    >
      {/* SUCCESS MESSAGE */}

      {savedMessage && (
        <div
          className="
            mb-4
            flex
            items-center
            gap-2.5
            p-3.5
            rounded-xl
            bg-[#edf8ee]
            border
            border-[#d7ead9]
            text-[#39894a]
          "
        >
          <ProfileIcon
            type="save"
            size={16}
          />

          <p
            className="
              m-0
              text-[14px]
              font-semibold
            "
          >
            Profile saved successfully.
          </p>
        </div>
      )}

      {/* ======================================
          PROFILE HEADER
      ====================================== */}

      <section className="sb-card p-5 sm:p-6">
        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-5
          "
        >
          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            <div
              className="
                w-16
                h-16
                shrink-0
                rounded-2xl
                bg-[#e8f5f1]
                text-[#0f766e]
                flex
                items-center
                justify-center
                text-[20px]
                font-bold
              "
            >
              {initials}
            </div>

            <div>
              <h2
                className="
                  m-0
                  text-[20px]
                  font-semibold
                  text-[#163b38]
                "
              >
                {savedProfile.name ||
                  "Your Name"}
              </h2>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mt-1.5
                  text-[#71817e]
                "
              >
                <ProfileIcon
                  type="briefcase"
                  size={13}
                />

                <p
                  className="
                    m-0
                    text-[14px]
                  "
                >
                  {savedProfile.role ||
                    "Target role not added"}
                </p>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mt-1
                  text-[#71817e]
                "
              >
                <ProfileIcon
                  type="mail"
                  size={13}
                />

                <p
                  className="
                    m-0
                    text-[13px]
                  "
                >
                  {savedProfile.email ||
                    currentUser?.email ||
                    "Email not added"}
                </p>
              </div>
            </div>
          </div>

          {!editing && (
            <button
              type="button"
              onClick={() =>
                setEditing(true)
              }
              className="
                sb-btn-secondary
                self-start
                md:self-auto
                min-h-[42px]
                px-4
                text-[14px]
              "
            >
              <ProfileIcon
                type="edit"
                size={15}
              />

              Edit Profile
            </button>
          )}
        </div>
      </section>

      {/* ======================================
          EDIT PROFILE
      ====================================== */}

      {editing && (
        <section className="sb-card p-5 sm:p-6 mt-5">
          <div
            className="
              flex
              items-start
              justify-between
              gap-4
              mb-5
            "
          >
            <div>
              <h2
                className="
                  m-0
                  text-[17px]
                  font-semibold
                  text-[#163b38]
                "
              >
                Edit Profile
              </h2>

              <p
                className="
                  m-0
                  mt-1
                  text-[13px]
                  text-[#71817e]
                "
              >
                Update your basic profile
                information.
              </p>
            </div>

            <button
              type="button"
              onClick={cancelEdit}
              className="
                w-8
                h-8
                rounded-lg
                border
                border-[#e2ebe7]
                text-[#71817e]
                flex
                items-center
                justify-center
                hover:bg-[#f4f8f6]
                transition
              "
              aria-label="Cancel editing"
            >
              <ProfileIcon
                type="close"
                size={15}
              />
            </button>
          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-4
            "
          >
            {/* NAME */}

            <div>
              <label
                htmlFor="profile-name"
                className="
                  block
                  mb-2
                  text-[13px]
                  font-semibold
                  text-[#526562]
                "
              >
                Full Name
              </label>

              <input
                id="profile-name"
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    name: e.target.value,
                  })
                }
                placeholder="Enter your name"
                className="sb-input"
              />
            </div>

            {/* ROLE */}

            <div>
              <label
                htmlFor="profile-role"
                className="
                  block
                  mb-2
                  text-[13px]
                  font-semibold
                  text-[#526562]
                "
              >
                Target Role
              </label>

              <input
                id="profile-role"
                type="text"
                value={profile.role}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    role: e.target.value,
                  })
                }
                placeholder="Example: Full Stack Developer"
                className="sb-input"
              />
            </div>

            {/* EMAIL */}

            <div className="md:col-span-2">
              <label
                htmlFor="profile-email"
                className="
                  block
                  mb-2
                  text-[13px]
                  font-semibold
                  text-[#526562]
                "
              >
                Email Address
              </label>

              <input
                id="profile-email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    email: e.target.value,
                  })
                }
                placeholder={
                  currentUser?.email ||
                  "Enter your email"
                }
                className="sb-input"
              />
            </div>

            {/* SKILLS */}

            <div className="md:col-span-2">
              <label
                htmlFor="profile-skills"
                className="
                  block
                  mb-2
                  text-[13px]
                  font-semibold
                  text-[#526562]
                "
              >
                Skills
              </label>

              <textarea
                id="profile-skills"
                value={profile.skills}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    skills: e.target.value,
                  })
                }
                rows="4"
                placeholder="Example: Java, React, SQL"
                className="
                  sb-input
                  min-h-[110px]
                  resize-y
                  leading-5
                "
              />

              <p
                className="
                  m-0
                  mt-1.5
                  text-[12px]
                  text-[#71817e]
                "
              >
                Separate each skill using a
                comma.
              </p>
            </div>
          </div>

          {/* BUTTONS */}

          <div
            className="
              flex
              flex-wrap
              gap-3
              mt-5
              pt-5
              border-t
              border-[#edf2f0]
            "
          >
            <button
              type="button"
              onClick={saveProfile}
              className="
                sb-btn-primary
                min-h-[42px]
                px-5
                text-[14px]
              "
            >
              <ProfileIcon
                type="save"
                size={15}
              />

              Save Profile
            </button>

            <button
              type="button"
              onClick={cancelEdit}
              className="
                sb-btn-secondary
                min-h-[42px]
                px-5
                text-[14px]
              "
            >
              Cancel
            </button>
          </div>
        </section>
      )}

      {/* ======================================
          DETAILS + SKILLS
      ====================================== */}

      {!editing && (
        <section
          className="
            grid
            grid-cols-1
            xl:grid-cols-[0.9fr_1.1fr]
            items-start
            gap-5
            mt-5
          "
        >
          {/* PROFILE DETAILS */}

          <div className="sb-card p-5 sm:p-6">
            <div
              className="
                flex
                items-start
                gap-3
                mb-5
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
                <ProfileIcon
                  type="user"
                  size={17}
                />
              </div>

              <div>
                <h2
                  className="
                    m-0
                    text-[16px]
                    font-semibold
                    text-[#163b38]
                  "
                >
                  Profile Details
                </h2>

                <p
                  className="
                    m-0
                    mt-1
                    text-[13px]
                    text-[#71817e]
                  "
                >
                  Your saved profile
                  information.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* FULL NAME */}

              <div
                className="
                  p-3.5
                  rounded-xl
                  bg-[#f8fbfa]
                  border
                  border-[#e7efec]
                "
              >
                <p
                  className="
                    m-0
                    text-[12px]
                    uppercase
                    tracking-wide
                    font-semibold
                    text-[#71817e]
                  "
                >
                  Full Name
                </p>

                <p
                  className="
                    m-0
                    mt-1
                    text-[14px]
                    font-medium
                    text-[#405653]
                  "
                >
                  {savedProfile.name ||
                    "Not added"}
                </p>
              </div>

              {/* TARGET ROLE */}

              <div
                className="
                  p-3.5
                  rounded-xl
                  bg-[#f8fbfa]
                  border
                  border-[#e7efec]
                "
              >
                <p
                  className="
                    m-0
                    text-[12px]
                    uppercase
                    tracking-wide
                    font-semibold
                    text-[#71817e]
                  "
                >
                  Target Role
                </p>

                <p
                  className="
                    m-0
                    mt-1
                    text-[14px]
                    font-medium
                    text-[#405653]
                  "
                >
                  {savedProfile.role ||
                    "Not added"}
                </p>
              </div>

              {/* EMAIL */}

              <div
                className="
                  p-3.5
                  rounded-xl
                  bg-[#f8fbfa]
                  border
                  border-[#e7efec]
                "
              >
                <p
                  className="
                    m-0
                    text-[12px]
                    uppercase
                    tracking-wide
                    font-semibold
                    text-[#71817e]
                  "
                >
                  Email
                </p>

                <p
                  className="
                    m-0
                    mt-1
                    text-[14px]
                    font-medium
                    text-[#405653]
                    break-all
                  "
                >
                  {savedProfile.email ||
                    currentUser?.email ||
                    "Not added"}
                </p>
              </div>
            </div>
          </div>

          {/* SKILLS */}

          <div className="sb-card p-5 sm:p-6">
            <div
              className="
                flex
                items-start
                gap-3
                mb-5
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
                <ProfileIcon
                  type="skills"
                  size={17}
                />
              </div>

              <div>
                <h2
                  className="
                    m-0
                    text-[16px]
                    font-semibold
                    text-[#163b38]
                  "
                >
                  Skills
                </h2>

                <p
                  className="
                    m-0
                    mt-1
                    text-[13px]
                    text-[#71817e]
                  "
                >
                  Skills saved in your
                  local profile.
                </p>
              </div>
            </div>

            {skills.length > 0 ? (
              <div
                className="
                  flex
                  flex-wrap
                  gap-2
                "
              >
                {skills.map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        px-3
                        py-2
                        rounded-lg
                        bg-[#f1f8f5]
                        border
                        border-[#dce9e4]
                        text-[13px]
                        font-semibold
                        text-[#0f766e]
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

                      {skill}
                    </span>
                  )
                )}
              </div>
            ) : (
              <div
                className="
                  py-8
                  text-center
                "
              >
                <p
                  className="
                    m-0
                    text-[14px]
                    text-[#71817e]
                  "
                >
                  No skills added yet.
                </p>
              </div>
            )}

            <div
              className="
                flex
                items-start
                gap-2
                mt-6
                pt-4
                border-t
                border-[#edf2f0]
                text-[#71817e]
              "
            >
              <div className="mt-[1px]">
                <ProfileIcon
                  type="info"
                  size={13}
                />
              </div>

              <p
                className="
                  m-0
                  text-[12px]
                  leading-4
                "
              >
                Profile details on this
                page are stored locally in
                this browser for the
                currently signed-in account.
              </p>
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
}

export default Profile;