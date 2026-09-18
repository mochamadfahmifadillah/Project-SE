import { useEffect, useState } from "react";
import Icon from "../../components/common/Icon";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { getMe } = useAuthContext();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);

        const response = await getMe();

        if (mounted) {
          setUser(response?.data ?? response ?? null);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [getMe]);

  const fullName = user?.name || "—";
  const email = user?.email || "—";
  const company = user?.company || user?.company_name || "—";

  if (loading) {
    return (
      <div className="account-page">
        <div className="account-page-header">
          <div>
            <p className="account-eyebrow">ACCOUNT</p>
            <h1>Profile</h1>
            <p>Manage your personal and business information.</p>
          </div>
        </div>

        <div className="account-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      {/* Header */}
      <div className="account-page-header">
        <div>
          <p className="account-eyebrow">ACCOUNT</p>

          <h1>Profile</h1>

          <p>
            Manage your personal information, business profile,
            preferences, and account security.
          </p>
        </div>
      </div>

      {/* Profile Hero */}
      <section className="profile-hero">
        <div className="profile-avatar">
          {fullName.charAt(0).toUpperCase()}
        </div>

        <div className="profile-hero-info">
          <h2>{fullName}</h2>

          <p>{email}</p>

          {company !== "—" && (
            <span className="profile-company">
              {company}
            </span>
          )}
        </div>

        <button
          type="button"
          className="profile-edit-button"
        >
          <Icon name="settings" size={17} />
          Edit Profile
        </button>
      </section>

      {/* Personal Information */}
      <section className="profile-section">
        <div className="profile-section-header">
          <div>
            <h2>Personal Information</h2>
            <p>
              Your basic account information.
            </p>
          </div>

          <Icon name="user" size={21} />
        </div>

        <div className="profile-grid">
          <div className="profile-field">
            <span>Full name</span>
            <strong>{fullName}</strong>
          </div>

          <div className="profile-field">
            <span>Email</span>
            <strong>{email}</strong>
          </div>
        </div>
      </section>

      {/* Business Profile */}
      <section className="profile-section">
        <div className="profile-section-header">
          <div>
            <h2>Business Profile</h2>
            <p>
              Information used to personalize software recommendations.
            </p>
          </div>

          <Icon name="chart" size={21} />
        </div>

        <div className="profile-grid">
          <div className="profile-field">
            <span>Company</span>
            <strong>{company}</strong>
          </div>

          <div className="profile-field">
            <span>Business size</span>
            <strong>
              {user?.business_size || "Not set"}
            </strong>
          </div>

          <div className="profile-field">
            <span>Industry</span>
            <strong>
              {user?.industry || "Not set"}
            </strong>
          </div>

          <div className="profile-field">
            <span>Business needs</span>
            <strong>
              {user?.business_need || "Not set"}
            </strong>
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="profile-section">
        <div className="profile-section-header">
          <div>
            <h2>Preferences</h2>
            <p>
              Control how Software Empire personalizes your experience.
            </p>
          </div>

          <Icon name="spark" size={21} />
        </div>

        <div className="profile-option">
          <div>
            <strong>Personalized Recommendations</strong>
            <p>
              Use your business profile to provide more relevant
              software recommendations.
            </p>
          </div>

          <span className="profile-status">
            Enabled
          </span>
        </div>

        <div className="profile-option">
          <div>
            <strong>Email Notifications</strong>
            <p>
              Receive updates about recommendations, reviews,
              and implementation requests.
            </p>
          </div>

          <span className="profile-status">
            Enabled
          </span>
        </div>
      </section>

      {/* Account Security */}
      <section className="profile-section">
        <div className="profile-section-header">
          <div>
            <h2>Account Security</h2>
            <p>
              Manage your account access and security.
            </p>
          </div>

          <Icon name="settings" size={21} />
        </div>

        <div className="profile-security-row">
          <div>
            <strong>Password</strong>
            <p>
              Keep your account secure with a strong password.
            </p>
          </div>

          <button
            type="button"
            className="profile-secondary-button"
          >
            Change Password
          </button>
        </div>
      </section>

      {/* Account Summary */}
      <section className="profile-section">
        <div className="profile-section-header">
          <div>
            <h2>Account Summary</h2>
            <p>
              Overview of your activity on Software Empire.
            </p>
          </div>

          <Icon name="file" size={21} />
        </div>

        <div className="profile-summary-grid">
          <div className="profile-summary-card">
            <Icon name="bookmark" size={20} />
            <span>Saved Software</span>
            <strong>—</strong>
          </div>

          <div className="profile-summary-card">
            <Icon name="compare" size={20} />
            <span>Comparisons</span>
            <strong>—</strong>
          </div>

          <div className="profile-summary-card">
            <Icon name="star" size={20} />
            <span>Reviews</span>
            <strong>—</strong>
          </div>

          <div className="profile-summary-card">
            <Icon name="file" size={20} />
            <span>Implementation Requests</span>
            <strong>—</strong>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="profile-section">
        <div className="profile-section-header">
          <div>
            <h2>Quick Actions</h2>
            <p>
              Quickly access other account features.
            </p>
          </div>

          <Icon name="arrow" size={21} />
        </div>

        <div className="profile-actions">
          <button type="button">
            <Icon name="bookmark" size={18} />
            Saved Software
          </button>

          <button type="button">
            <Icon name="compare" size={18} />
            My Comparisons
          </button>

          <button type="button">
            <Icon name="lightbulb" size={18} />
            Recommendations
          </button>

          <button type="button">
            <Icon name="star" size={18} />
            My Reviews
          </button>
        </div>
      </section>
    </div>
  );
}