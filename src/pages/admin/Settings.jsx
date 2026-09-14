import { useState } from "react";
import {
  Bell,
  Globe,
  Save,
  Settings as SettingsIcon,
  ShieldCheck,
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";

export default function Settings() {
  const [settings, setSettings] = useState({
    platformName: "Software Empire",
    platformUrl: "",
    platformEmail: "",
    timezone: "Asia/Jakarta",
    maintenanceMode: false,
    emailNotifications: true,
    reviewNotifications: true,
    leadNotifications: true,
  });

  const [saved, setSaved] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setSettings((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSaved(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  }

  return (
    <AdminLayout>
      <div className="admin-content settings-page">
        {/* Page Header */}
        <div className="page-head">
          <div>
            <span className="eyebrow">ADMIN PORTAL</span>

            <h1>Settings</h1>

            <p>
              Manage platform settings and configuration for Software
              Empire.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* General Settings */}
          <div className="admin-card settings-card">
            <div className="settings-card-header">
              <div className="settings-heading">
                <div className="settings-icon">
                  <SettingsIcon size={20} />
                </div>

                <div>
                  <h2>General Settings</h2>

                  <p>
                    Configure the basic information of your platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="settings-grid">
              <div className="settings-field">
                <label htmlFor="platformName">
                  Platform Name
                </label>

                <input
                  id="platformName"
                  name="platformName"
                  type="text"
                  value={settings.platformName}
                  onChange={handleChange}
                />
              </div>

              <div className="settings-field">
                <label htmlFor="platformUrl">
                  Platform URL
                </label>

                <input
                  id="platformUrl"
                  name="platformUrl"
                  type="url"
                  value={settings.platformUrl}
                  onChange={handleChange}
                  placeholder="https://softwareempire.com"
                />
              </div>

              <div className="settings-field">
                <label htmlFor="platformEmail">
                  Platform Email
                </label>

                <input
                  id="platformEmail"
                  name="platformEmail"
                  type="email"
                  value={settings.platformEmail}
                  onChange={handleChange}
                  placeholder="admin@softwareempire.com"
                />
              </div>

              <div className="settings-field">
                <label htmlFor="timezone">
                  Timezone
                </label>

                <select
                  id="timezone"
                  name="timezone"
                  value={settings.timezone}
                  onChange={handleChange}
                >
                  <option value="Asia/Jakarta">
                    Asia/Jakarta
                  </option>

                  <option value="Asia/Makassar">
                    Asia/Makassar
                  </option>

                  <option value="Asia/Jayapura">
                    Asia/Jayapura
                  </option>

                  <option value="UTC">
                    UTC
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Platform Settings */}
          <div className="admin-card settings-card">
            <div className="settings-card-header">
              <div className="settings-heading">
                <div className="settings-icon">
                  <Globe size={20} />
                </div>

                <div>
                  <h2>Platform Settings</h2>

                  <p>
                    Control the availability and behavior of the
                    platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="settings-options">
              <ToggleSetting
                name="maintenanceMode"
                title="Maintenance Mode"
                description="Temporarily disable public platform access while maintenance is in progress."
                checked={settings.maintenanceMode}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Notification Settings */}
          <div className="admin-card settings-card">
            <div className="settings-card-header">
              <div className="settings-heading">
                <div className="settings-icon">
                  <Bell size={20} />
                </div>

                <div>
                  <h2>Notification Settings</h2>

                  <p>
                    Choose which platform events should generate
                    notifications.
                  </p>
                </div>
              </div>
            </div>

            <div className="settings-options">
              <ToggleSetting
                name="emailNotifications"
                title="Email Notifications"
                description="Receive important platform notifications through email."
                checked={settings.emailNotifications}
                onChange={handleChange}
              />

              <ToggleSetting
                name="reviewNotifications"
                title="Review Notifications"
                description="Receive notifications when users submit new software reviews."
                checked={settings.reviewNotifications}
                onChange={handleChange}
              />

              <ToggleSetting
                name="leadNotifications"
                title="Lead Notifications"
                description="Receive notifications when new implementation leads are created."
                checked={settings.leadNotifications}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Security Information */}
          <div className="settings-security">
            <div className="settings-security-icon">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h3>Configuration Security</h3>

              <p>
                Only authorized administrators should modify platform
                settings.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="settings-actions">
            {saved && (
              <span className="settings-success">
                Settings saved successfully.
              </span>
            )}

            <button
              type="submit"
              className="settings-save-button"
            >
              <Save size={17} />

              Save Changes
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

/*
|--------------------------------------------------------------------------
| Toggle Setting
|--------------------------------------------------------------------------
*/

function ToggleSetting({
  name,
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <label className="setting-toggle">
      <div className="setting-toggle-content">
        <span className="setting-toggle-title">
          {title}
        </span>

        <span className="setting-toggle-description">
          {description}
        </span>
      </div>

      <span className="toggle-control">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
        />

        <span className="toggle-slider" />
      </span>
    </label>
  );
}