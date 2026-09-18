import { useEffect, useState } from "react";
import { Building2, Mail, UserRound } from "lucide-react";

import Button from "../../components/common/Button";

import { getMe } from "../../services/authService";

export default function Settings() {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Load Current User
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        setLoading(true);
        setError("");

        const response = await getMe();

        if (cancelled) return;

        const currentUser =
          response?.user || response?.data?.user || response?.data || response;

        setUser(currentUser);

        setForm({
          name: currentUser?.name || "",
          email: currentUser?.email || "",
          company: currentUser?.company_name || currentUser?.company || "",
        });
      } catch (err) {
        console.error("Failed to load account settings:", err);

        if (!cancelled) {
          setError(err?.message || "Unable to load your account settings.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Handle Change
  |--------------------------------------------------------------------------
  */

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setSaved(false);
    setError("");
  }

  /*
  |--------------------------------------------------------------------------
  | Save
  |--------------------------------------------------------------------------
  */

  async function handleSave(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setSaved(false);
      setError("");

      /*
      |--------------------------------------------------------------------------
      | TODO:
      | Connect to update profile API.
      |--------------------------------------------------------------------------
      */

      setUser((current) => ({
        ...current,
        name: form.name,
        email: form.email,
        company_name: form.company,
      }));

      setSaved(true);
    } catch (err) {
      console.error("Failed to save settings:", err);

      setError(err?.message || "Unable to save your settings.");
    } finally {
      setSaving(false);
    }
  }

  const initials =
    form.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase() || "U";

  return (
    <main className="page narrow">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="page-head">
        <div>
          <span className="eyebrow">MY ACCOUNT</span>

          <h1>Settings</h1>

          <p>Manage your account information and preferences.</p>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}
      {error && (
        <div className="auth-error" role="alert">
          <strong>Something went wrong</strong>

          <span>{error}</span>
        </div>
      )}

      {/* =====================================================
          SETTINGS CARD
      ====================================================== */}
      <div className="form-card settings-form-card">
        {loading ? (
          <div className="empty">
            <div className="software-logo settings-loading-logo">...</div>

            <h3>Loading your settings...</h3>

            <p>Please wait while we load your account information.</p>
          </div>
        ) : (
          <>
            {/* PROFILE SUMMARY */}
            <div className="settings-profile">
              <div className="settings-avatar">{initials}</div>

              <div>
                <span className="eyebrow">ACCOUNT PROFILE</span>

                <h2>{form.name || "Your account"}</h2>

                <p>{form.email || "No email address available"}</p>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="settings-divider" />

            {/* FORM */}
            <form onSubmit={handleSave}>
              <div className="settings-section-head">
                <div>
                  <span className="eyebrow">PROFILE INFORMATION</span>

                  <h2>Personal details</h2>

                  <p>Keep your account information up to date.</p>
                </div>
              </div>

              <div className="form-grid">
                {/* NAME */}
                <label>
                  <span className="settings-label">
                    <UserRound size={15} />
                    Full name
                  </span>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </label>

                {/* EMAIL */}
                <label>
                  <span className="settings-label">
                    <Mail size={15} />
                    Email
                  </span>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                </label>

                {/* COMPANY */}
                <label className="full">
                  <span className="settings-label">
                    <Building2 size={15} />
                    Company
                  </span>

                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Your company"
                    autoComplete="organization"
                  />

                  <small>
                    Your company information helps us provide more relevant
                    software recommendations.
                  </small>
                </label>
              </div>

              {/* ACTIONS */}
              <div className="form-actions settings-actions">
                {saved && (
                  <span className="success-text">
                    ✓ Settings saved successfully.
                  </span>
                )}

                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
