import { useEffect, useMemo, useState } from "react";

import Icon from "../../components/common/Icon";
import { useAuthContext } from "../../context/AuthContext";

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

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    job_title: "",
    location: "",
    company: "",
    business_size: "",
    industry: "",
    business_need: "",
    bio: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Sync authenticated user -> profile form
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Loading authentication
  |--------------------------------------------------------------------------
  */

  if (authLoading) {
    return (
      <div className="profile-page">
        <div className="account-state">
          <h2>Checking authentication...</h2>
          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | User not found
  |--------------------------------------------------------------------------
  */

  if (!authUser) {
    return (
      <div className="profile-page">
        <div className="account-state">
          <h2>Profile unavailable</h2>
          <p>We could not load the authenticated user profile.</p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const fullName = authUser.name || "—";
  const email = authUser.email || "—";

  const avatar =
    authUser.avatar ||
    authUser.avatar_url ||
    authUser.profile_picture ||
    authUser.profilePicture ||
    null;

  const initials = useMemo(() => {
    if (!fullName || fullName === "—") return "U";

    return fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  }, [fullName]);

  const memberSince = authUser.created_at
    ? new Date(authUser.created_at).toLocaleDateString("en-US", {
        month: "long",
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

  /*
  |--------------------------------------------------------------------------
  | Change handler
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setSaveStatus("");
    setErrorMessage("");
  };

  /*
  |--------------------------------------------------------------------------
  | Save profile
  |--------------------------------------------------------------------------
  */

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setSaveStatus("");
      setErrorMessage("");

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim() || null,
        job_title: formData.job_title.trim() || null,
        location: formData.location.trim() || null,
        company: formData.company.trim() || null,
        business_size: formData.business_size.trim() || null,
        industry: formData.industry.trim() || null,
        business_need: formData.business_need.trim() || null,
        bio: formData.bio.trim() || null,
      };

      const response = await updateProfile(payload);

      const updatedUser = response?.data?.user || response?.user || null;

      if (updatedUser) {
        setFormData({
          name: updatedUser.name || "",
          phone: updatedUser.phone || "",
          job_title: updatedUser.job_title || "",
          location: updatedUser.location || "",
          company: updatedUser.company || "",
          business_size: updatedUser.business_size || "",
          industry: updatedUser.industry || "",
          business_need: updatedUser.business_need || "",
          bio: updatedUser.bio || "",
        });
      }

      setSaveStatus("Profile updated successfully.");

      setTimeout(() => {
        setSaveStatus("");
      }, 3000);
    } catch (error) {
      console.error("Profile update failed:", error);

      setErrorMessage(
        error?.message || "Failed to update profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Public profile
  |--------------------------------------------------------------------------
  */

  const handleViewPublicProfile = () => {
    if (!authUser?.id) return;

    window.open(`/profile/${authUser.id}`, "_blank", "noopener,noreferrer");
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="profile-page">
      {/* ======================================================
          PROFILE HEADER
      ====================================================== */}

      <section className="profile-header">
        <div className="profile-header-main">
          <div className="profile-avatar">
            {avatar ? (
              <img src={avatar} alt={fullName} />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div className="profile-header-info">
            <h1>{fullName}</h1>

            <p>{email}</p>

            <span className="profile-member">Member since {memberSince}</span>
          </div>
        </div>

        <button
          type="button"
          className="profile-public-button"
          onClick={handleViewPublicProfile}
        >
          <Icon name="external-link" />
          View Public Profile
        </button>
      </section>

      {/* ======================================================
          PROFILE COMPLETENESS
      ====================================================== */}

      <section className="profile-completion-card">
        <div className="profile-completion-info">
          <div>
            <h3>Profile Completeness</h3>

            <p>
              Complete your profile to get more accurate software
              recommendations.
            </p>
          </div>

          <strong>{profileCompleteness}%</strong>
        </div>

        <div className="profile-progress-track">
          <div
            className="profile-progress-bar"
            style={{
              width: `${profileCompleteness}%`,
            }}
          />
        </div>
      </section>

      {/* ======================================================
          TABS
      ====================================================== */}

      <div className="profile-tabs">
        <button
          type="button"
          className={
            activeTab === "personal" ? "profile-tab active" : "profile-tab"
          }
          onClick={() => setActiveTab("personal")}
        >
          Personal Information
        </button>

        <button
          type="button"
          className={
            activeTab === "business" ? "profile-tab active" : "profile-tab"
          }
          onClick={() => setActiveTab("business")}
        >
          Business Information
        </button>

        <button
          type="button"
          className={
            activeTab === "preferences" ? "profile-tab active" : "profile-tab"
          }
          onClick={() => setActiveTab("preferences")}
        >
          Preferences
        </button>

        <button
          type="button"
          className={
            activeTab === "security" ? "profile-tab active" : "profile-tab"
          }
          onClick={() => setActiveTab("security")}
        >
          Security
        </button>
      </div>

      {/* ======================================================
          PERSONAL INFORMATION
      ====================================================== */}

      {activeTab === "personal" && (
        <form className="profile-section" onSubmit={handleSaveProfile}>
          <div className="profile-section-header">
            <div>
              <h2>Personal Information</h2>

              <p>Manage your personal information and contact details.</p>
            </div>
          </div>

          <div className="profile-form-grid">
            <div className="profile-field">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="profile-input"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="profile-field">
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                type="email"
                value={email}
                className="profile-input"
                disabled
              />

              <small>Email address cannot be changed here.</small>
            </div>

            <div className="profile-field">
              <label htmlFor="phone">Phone Number</label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="profile-input"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="profile-field">
              <label htmlFor="job_title">Job Title</label>

              <input
                id="job_title"
                name="job_title"
                type="text"
                value={formData.job_title}
                onChange={handleChange}
                className="profile-input"
                placeholder="e.g. Product Manager"
              />
            </div>

            <div className="profile-field">
              <label htmlFor="location">Location</label>

              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="profile-input"
                placeholder="e.g. Bandung, Indonesia"
              />
            </div>
          </div>

          <div className="profile-field profile-bio-field">
            <label htmlFor="bio">Bio</label>

            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="profile-textarea"
              placeholder="Tell us a little about yourself..."
              rows={5}
              maxLength={1000}
            />

            <small>{formData.bio.length}/1000 characters</small>
          </div>

          {/* ==================================================
              SAVE STATUS
          ================================================== */}

          {saveStatus && (
            <div className="profile-success">
              <Icon name="check" />
              <span>{saveStatus}</span>
            </div>
          )}

          {errorMessage && (
            <div className="profile-error">
              <Icon name="alert-circle" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="profile-actions">
            <button
              type="submit"
              className="profile-save-button"
              disabled={saving}
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Icon name="check" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ======================================================
          BUSINESS INFORMATION
      ====================================================== */}

      {activeTab === "business" && (
        <form className="profile-section" onSubmit={handleSaveProfile}>
          <div className="profile-section-header">
            <div>
              <h2>Business Information</h2>

              <p>
                Tell us about your company so we can provide more relevant
                recommendations.
              </p>
            </div>
          </div>

          <div className="profile-form-grid">
            <div className="profile-field">
              <label htmlFor="company">Company</label>

              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                className="profile-input"
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
                className="profile-input"
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
                type="text"
                value={formData.industry}
                onChange={handleChange}
                className="profile-input"
                placeholder="e.g. Technology"
              />
            </div>

            <div className="profile-field">
              <label htmlFor="business_need">Primary Business Need</label>

              <input
                id="business_need"
                name="business_need"
                type="text"
                value={formData.business_need}
                onChange={handleChange}
                className="profile-input"
                placeholder="e.g. CRM, Accounting, HR"
              />
            </div>
          </div>

          {saveStatus && (
            <div className="profile-success">
              <Icon name="check" />
              <span>{saveStatus}</span>
            </div>
          )}

          {errorMessage && (
            <div className="profile-error">
              <Icon name="alert-circle" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="profile-actions">
            <button
              type="submit"
              className="profile-save-button"
              disabled={saving}
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Icon name="check" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ======================================================
          PREFERENCES
      ====================================================== */}

      {activeTab === "preferences" && (
        <section className="profile-section">
          <div className="profile-section-header">
            <div>
              <h2>Preferences</h2>

              <p>Customize your Software Empire experience.</p>
            </div>
          </div>

          <div className="profile-preferences">
            <div className="profile-preference-item">
              <div>
                <h3>Software Recommendations</h3>

                <p>
                  Receive personalized software recommendations based on your
                  profile.
                </p>
              </div>

              <label className="profile-switch">
                <input type="checkbox" defaultChecked />
                <span />
              </label>
            </div>

            <div className="profile-preference-item">
              <div>
                <h3>Product Updates</h3>

                <p>Receive updates about new software and platform features.</p>
              </div>

              <label className="profile-switch">
                <input type="checkbox" defaultChecked />
                <span />
              </label>
            </div>

            <div className="profile-preference-item">
              <div>
                <h3>Newsletter</h3>

                <p>Receive Software Empire insights and industry updates.</p>
              </div>

              <label className="profile-switch">
                <input type="checkbox" defaultChecked />
                <span />
              </label>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          SECURITY
      ====================================================== */}

      {activeTab === "security" && (
        <section className="profile-section">
          <div className="profile-section-header">
            <div>
              <h2>Security</h2>

              <p>Manage your account security and password.</p>
            </div>
          </div>

          <div className="profile-security-list">
            <div className="profile-security-item">
              <div className="profile-security-icon">
                <Icon name="lock" />
              </div>

              <div>
                <h3>Password</h3>

                <p>Your password is securely encrypted.</p>
              </div>

              <button type="button" className="profile-secondary-button">
                Change Password
              </button>
            </div>

            <div className="profile-security-item">
              <div className="profile-security-icon">
                <Icon name="shield" />
              </div>

              <div>
                <h3>Account Protection</h3>

                <p>Your account is protected by authentication.</p>
              </div>

              <span className="profile-security-status">Protected</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Profile;
