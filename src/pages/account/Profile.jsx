import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../../components/common/Icon";
import { useAuthContext } from "../../context/AuthContext";

const TABS = [
  { id: "personal", label: "Personal Information", icon: "user" },
  { id: "business", label: "Business Profile", icon: "briefcase" },
  { id: "preferences", label: "Preferences", icon: "settings" },
  { id: "security", label: "Account Security", icon: "lock" },
];

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://software-empire-backend.vercel.app/api/v1"
).replace(/\/+$/, "");

const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/i, "");

const INITIAL_FORM = {
  name: "",
  phone: "",
  job_title: "",
  location: "",
  company: "",
  business_size: "",
  industry: "",
  business_need: "",
  bio: "",
};

function getAvatarUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const path = value.trim();

  // URL eksternal, data URL, dan preview lokal.
  if (/^(https?:\/\/|data:|blob:)/i.test(path)) {
    return path;
  }

  const normalizedPath = path
    .replace(/^\/+/, "")
    .replace(/^api\/v1\//i, "")
    .replace(/^storage\//i, "");

  if (
    !normalizedPath ||
    normalizedPath.split("/").some((segment) => segment === "..")
  ) {
    return null;
  }

  return `${API_ORIGIN}/storage/${normalizedPath}`;
}

function getUserAvatar(user) {
  return (
    user?.avatar_url ??
    user?.avatar ??
    user?.profile_picture ??
    user?.profilePicture ??
    user?.profile_photo_url ??
    user?.profile_photo ??
    user?.photo_url ??
    null
  );
}

function getErrorMessage(error) {
  const data = error?.response?.data ?? error?.data;

  if (data?.errors && typeof data.errors === "object") {
    const firstError = Object.values(data.errors).flat()[0];

    if (typeof firstError === "string") {
      return firstError;
    }
  }

  return (
    data?.message ||
    error?.message ||
    "Failed to update profile. Please try again."
  );
}

function Profile() {
  const {
    user: authUser,
    loading: authLoading,
    updateProfile,
  } = useAuthContext();

  const [activeTab, setActiveTab] = useState("personal");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState(true);

  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);

  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => {
    if (!authUser) return;

    setFormData({
      name: authUser.name || "",
      phone: authUser.phone || "",
      job_title: authUser.job_title || "",
      location: authUser.location || "",
      company: authUser.company || "",
      business_size: authUser.business_size || "",
      industry: authUser.industry || "",
      business_need: authUser.business_need || "",
      bio: authUser.bio || "",
    });
  }, [authUser]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const fullName = authUser?.name || "User";
  const email = authUser?.email || "—";

  const savedAvatar = getAvatarUrl(getUserAvatar(authUser));
  const avatar = avatarPreview || savedAvatar;

  const initials = useMemo(() => {
    const result = fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();

    return result || "U";
  }, [fullName]);

  useEffect(() => {
    setAvatarLoadFailed(false);
  }, [avatar]);

  const memberSince = authUser?.created_at
    ? new Date(authUser.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const profileFields = [
    formData.name,
    formData.phone,
    formData.job_title,
    formData.location,
    formData.company,
    formData.business_size,
    formData.industry,
    formData.business_need,
    formData.bio,
  ];

  const completedFields = profileFields.filter(
    (value) => value && String(value).trim() !== "",
  ).length;

  const profileCompleteness = Math.round(
    (completedFields / profileFields.length) * 100,
  );

  const interests = (formData.business_need || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);

  const comparisons =
    authUser?.total_comparisons ?? authUser?.comparisons_count ?? "—";

  const recommendations = authUser?.recommendations_count ?? "—";
  const reviews = authUser?.reviews_count ?? "—";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setSaveStatus("");
    setErrorMessage("");
  };

  const clearAvatarPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setAvatarPreview(null);
    setAvatarFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Please select a JPG, PNG, GIF, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Avatar image must be smaller than 2MB.");
      event.target.value = "";
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);

    previewUrlRef.current = previewUrl;

    setAvatarFile(file);
    setAvatarPreview(previewUrl);
    setAvatarLoadFailed(false);
    setSaveStatus("");
    setErrorMessage("");
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    if (saving) return;

    if (!formData.name.trim()) {
      setErrorMessage("Full name is required.");
      return;
    }

    if (typeof updateProfile !== "function") {
      setErrorMessage(
        "Profile update is unavailable. Please check AuthContext.",
      );
      return;
    }

    try {
      setSaving(true);
      setSaveStatus("");
      setErrorMessage("");

      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, typeof value === "string" ? value.trim() : value);
      });

      if (avatarFile) {
        payload.append("avatar", avatarFile, avatarFile.name);
      }

      // updateProfile must send FormData without forcing
      // Content-Type: application/json.
      const response = await updateProfile(payload);

      if (response?.success === false) {
        throw new Error(response.message || "Profile update failed.");
      }

      const updatedUser =
        response?.data?.user ??
        response?.user ??
        response?.data?.data?.user ??
        null;

      if (updatedUser) {
        setFormData({
          name: updatedUser.name ?? formData.name,
          phone: updatedUser.phone ?? formData.phone,
          job_title: updatedUser.job_title ?? formData.job_title,
          location: updatedUser.location ?? formData.location,
          company: updatedUser.company ?? formData.company,
          business_size: updatedUser.business_size ?? formData.business_size,
          industry: updatedUser.industry ?? formData.industry,
          business_need: updatedUser.business_need ?? formData.business_need,
          bio: updatedUser.bio ?? formData.bio,
        });
      }

      clearAvatarPreview();
      setAvatarLoadFailed(false);
      setSaveStatus("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update failed:", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleViewPublicProfile = () => {
    if (!authUser?.id) return;

    window.open(`/profile/${authUser.id}`, "_blank", "noopener,noreferrer");
  };

  const renderAvatar = () => (
    <div className="profile-avatar-wrapper">
      <div className="profile-avatar">
        {avatar && !avatarLoadFailed ? (
          <img
            key={avatar}
            src={avatar}
            alt={`${fullName} profile`}
            onLoad={() => setAvatarLoadFailed(false)}
            onError={() => {
              console.error("Profile avatar failed to load:", avatar);
              setAvatarLoadFailed(true);
            }}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="profile-avatar-button"
        aria-label="Choose profile avatar"
        disabled={saving}
      >
        <Icon name="camera" />
      </button>
    </div>
  );

  if (authLoading) {
    return (
      <div className="profile-state">
        <div className="profile-state-content">
          <h2>Checking authentication...</h2>
          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="profile-state">
        <div className="profile-state-content">
          <h2>Profile unavailable</h2>
          <p>We could not load the authenticated user profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="profile-file-input"
        onChange={handleAvatarChange}
        disabled={saving}
      />

      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-breadcrumb">
            <span>Home</span>
            <span>›</span>
            <span>Account</span>
            <span>›</span>
            <span className="active">Profile</span>
          </div>

          <h1>Profile</h1>
          <p>Manage your personal and business information</p>
        </div>

        <button
          type="button"
          onClick={handleViewPublicProfile}
          className="profile-outline-button"
        >
          View Public Profile
          <Icon name="external-link" />
        </button>
      </div>

      <section className="profile-card profile-completeness">
        <div className="profile-completeness-header">
          <div>
            <h3>Profile Completeness</h3>
            <p>
              Complete your profile to get more accurate software
              recommendations.
            </p>
          </div>
          <strong>{profileCompleteness}%</strong>
        </div>

        <div className="profile-progress">
          <div
            className="profile-progress-bar"
            style={{ width: `${profileCompleteness}%` }}
          />
        </div>
      </section>

      <div className="profile-tabs-wrapper">
        <div className="profile-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`profile-tab ${activeTab === tab.id ? "active" : ""}`}
            >
              <Icon name={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === "personal" && (
        <form onSubmit={handleSaveProfile} className="profile-form">
          <div className="profile-personal-grid">
            <section className="profile-card">
              <div className="profile-section-header">
                <h2>Personal Information</h2>
                <p>Manage your personal information and contact details.</p>
              </div>

              <div className="profile-personal-layout">
                <div className="profile-avatar-column">
                  {renderAvatar()}

                  <p className="profile-avatar-help">
                    JPG, PNG, GIF or WebP.
                    <br />
                    Max size 2MB
                  </p>

                  {avatarFile && (
                    <p className="profile-avatar-help">
                      Selected: {avatarFile.name}
                    </p>
                  )}
                </div>

                <div className="profile-fields-grid">
                  <div className="profile-field">
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="profile-field">
                    <label htmlFor="email">Email Address</label>
                    <div className="profile-email">
                      <input id="email" type="email" value={email} disabled />
                      <span>Verified</span>
                    </div>
                  </div>

                  <div className="profile-field">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="profile-field">
                    <label htmlFor="job_title">Job Title</label>
                    <input
                      id="job_title"
                      name="job_title"
                      value={formData.job_title}
                      onChange={handleChange}
                      placeholder="e.g. Product Manager"
                    />
                  </div>

                  <div className="profile-field full">
                    <label htmlFor="location">Location</label>
                    <input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Bandung, Indonesia"
                    />
                  </div>

                  <div className="profile-form-action full">
                    <button
                      type="submit"
                      disabled={saving}
                      className="profile-primary-button"
                    >
                      <Icon name="check" />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="profile-card">
              <div className="profile-section-header">
                <h2>About You</h2>
                <p>Tell us about yourself.</p>
              </div>

              <div className="profile-field">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  maxLength={1000}
                  placeholder="Tell us a little about yourself..."
                />
                <div className="profile-counter">
                  {formData.bio.length}/1000
                </div>
              </div>

              <div className="profile-interest-section">
                <div className="profile-interest-title">Areas of Interest</div>

                <div className="profile-interest-list">
                  {interests.length ? (
                    interests.map((interest) => (
                      <span key={interest} className="profile-interest">
                        {interest}
                      </span>
                    ))
                  ) : (
                    <span className="profile-interest-empty">
                      Add your interests from Business Profile
                    </span>
                  )}
                </div>
              </div>

              <div className="profile-divider" />

              <div className="profile-setting">
                <div>
                  <h3>Email Notifications</h3>
                  <p>Receive updates about new software and recommendations.</p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={emailNotifications}
                  onClick={() => setEmailNotifications((current) => !current)}
                  className={`profile-switch ${
                    emailNotifications ? "active" : ""
                  }`}
                >
                  <span />
                </button>
              </div>
            </section>
          </div>

          {saveStatus && (
            <div className="profile-status success" role="status">
              <Icon name="check" />
              <span>{saveStatus}</span>
            </div>
          )}

          {errorMessage && (
            <div className="profile-status error" role="alert">
              <Icon name="alert-circle" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="profile-bottom-grid">
            <section className="profile-card">
              <div className="profile-section-header">
                <h2>Account Summary</h2>
              </div>

              <div className="profile-summary-grid">
                <div>
                  <span>Member Since</span>
                  <strong>{memberSince}</strong>
                </div>
                <div>
                  <span>Total Comparisons</span>
                  <strong>{comparisons}</strong>
                </div>
                <div>
                  <span>Recommendations</span>
                  <strong>{recommendations}</strong>
                </div>
                <div>
                  <span>Reviews Written</span>
                  <strong>{reviews}</strong>
                </div>
              </div>
            </section>

            <section className="profile-card">
              <h2 className="profile-card-title">Quick Actions</h2>

              <div className="profile-action-list">
                <button
                  type="button"
                  onClick={() => setActiveTab("security")}
                  className="profile-action-button"
                >
                  <Icon name="lock" />
                  Change Password
                </button>

                <button type="button" className="profile-action-button">
                  <Icon name="download" />
                  Download My Data
                </button>

                <button type="button" className="profile-action-button danger">
                  <Icon name="trash" />
                  Delete Account
                </button>
              </div>
            </section>
          </div>
        </form>
      )}

      {activeTab === "business" && (
        <form onSubmit={handleSaveProfile} className="profile-card">
          <div className="profile-section-header">
            <h2>Business Profile</h2>
            <p>
              Tell us about your company so we can provide more relevant
              recommendations.
            </p>
          </div>

          <div className="profile-business-grid">
            <div className="profile-field">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </div>

            <div className="profile-field">
              <label htmlFor="business_size">Business Size</label>
              <select
                id="business_size"
                name="business_size"
                value={formData.business_size}
                onChange={handleChange}
              >
                <option value="">Select business size</option>
                <option value="Micro">Micro</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>

            <div className="profile-field">
              <label htmlFor="industry">Industry</label>
              <input
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g. Technology"
              />
            </div>

            <div className="profile-field">
              <label htmlFor="business_need">Primary Business Need</label>
              <input
                id="business_need"
                name="business_need"
                value={formData.business_need}
                onChange={handleChange}
                placeholder="e.g. CRM, Accounting, HR"
              />
            </div>
          </div>

          {saveStatus && (
            <div className="profile-status success" role="status">
              <Icon name="check" />
              <span>{saveStatus}</span>
            </div>
          )}

          {errorMessage && (
            <div className="profile-status error" role="alert">
              <Icon name="alert-circle" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="profile-form-action">
            <button
              type="submit"
              disabled={saving}
              className="profile-primary-button"
            >
              <Icon name="check" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {activeTab === "preferences" && (
        <section className="profile-card">
          <div className="profile-section-header">
            <h2>Preferences</h2>
            <p>Customize your Software Empire experience.</p>
          </div>

          <div className="profile-preferences">
            {[
              {
                title: "Software Recommendations",
                description:
                  "Receive personalized software recommendations based on your profile.",
              },
              {
                title: "Product Updates",
                description:
                  "Receive updates about new software and platform features.",
              },
              {
                title: "Newsletter",
                description:
                  "Receive Software Empire insights and industry updates.",
              },
            ].map((item) => (
              <div key={item.title} className="profile-preference-item">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <button
                  type="button"
                  className="profile-switch active"
                  aria-label={item.title}
                >
                  <span />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "security" && (
        <section className="profile-card">
          <div className="profile-section-header">
            <h2>Account Security</h2>
            <p>Manage your account security and password.</p>
          </div>

          <div className="profile-security">
            <div className="profile-security-item">
              <div className="profile-security-icon blue">
                <Icon name="lock" />
              </div>

              <div className="profile-security-content">
                <h3>Password</h3>
                <p>Your password is securely encrypted.</p>
              </div>

              <button type="button" className="profile-outline-button">
                Change Password
              </button>
            </div>

            <div className="profile-security-item">
              <div className="profile-security-icon green">
                <Icon name="shield" />
              </div>

              <div className="profile-security-content">
                <h3>Account Protection</h3>
                <p>Your account is protected by authentication.</p>
              </div>

              <span className="profile-protected">Protected</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Profile;
