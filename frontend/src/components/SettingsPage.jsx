import { useState } from "react";

import {
  FaBell,
  FaBrain,
  FaCheck,
  FaDownload,
  FaPalette,
  FaRotateLeft,
  FaShieldHalved,
  FaUser,
} from "react-icons/fa6";

const DEFAULT_SETTINGS = {
  profileName: "Arjeet Singh",
  email: "",
  companyName: "SmartStock AI",
  currency: "INR",
  lowStockThreshold: 20,
  forecastRefresh: 15,
  emailNotifications: true,
  stockAlerts: true,
  forecastAlerts: true,
  aiSuggestions: true,
  soundEffects: false,
  compactMode: false,
};

function SettingToggle({
  checked,
  onChange,
  label,
  description,
}) {
  return (
    <div className="settings-toggle-row">
      <div>
        <strong>{label}</strong>
        <p>{description}</p>
      </div>

      <button
        type="button"
        className={`settings-switch ${
          checked ? "active" : ""
        }`}
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        aria-label={label}
      >
        <span />
      </button>
    </div>
  );
}

function SettingsPage({ settings, setSettings }) {
  const [draft, setDraft] = useState(
    settings || DEFAULT_SETTINGS
  );

  const [saved, setSaved] = useState(false);

  const updateField = (field, value) => {
    setDraft((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSaved(false);
  };

  const saveSettings = () => {
    setSettings(draft);

    localStorage.setItem(
      "smartstock_app_settings",
      JSON.stringify(draft)
    );

    document.body.classList.toggle(
      "smartstock-compact-mode",
      Boolean(draft.compactMode)
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const resetSettings = () => {
    setDraft(DEFAULT_SETTINGS);
    setSettings(DEFAULT_SETTINGS);

    localStorage.setItem(
      "smartstock_app_settings",
      JSON.stringify(DEFAULT_SETTINGS)
    );

    document.body.classList.remove(
      "smartstock-compact-mode"
    );

    setSaved(false);
  };

  const exportSettings = () => {
    const content = JSON.stringify(draft, null, 2);

    const blob = new Blob([content], {
      type: "application/json",
    });

    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = downloadUrl;
    anchor.download = "smartstock-settings.json";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <section className="settings-page">
      <div className="settings-page-header">
        <div>
          <span className="settings-eyebrow">
            SYSTEM PREFERENCES
          </span>

          <h2>Workspace Settings</h2>

          <p>
            Configure your profile, alerts, AI behavior and
            inventory preferences.
          </p>
        </div>

        <div className="settings-header-actions">
          <button
            type="button"
            className="settings-secondary-button"
            onClick={exportSettings}
          >
            <FaDownload />
            Export
          </button>

          <button
            type="button"
            className="settings-save-button"
            onClick={saveSettings}
          >
            {saved ? <FaCheck /> : <FaShieldHalved />}
            {saved ? "Saved" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="settings-grid">
        <article className="settings-panel">
          <div className="settings-panel-title">
            <div className="settings-panel-icon">
              <FaUser />
            </div>

            <div>
              <h3>Profile</h3>
              <p>
                Information displayed across your workspace.
              </p>
            </div>
          </div>

          <div className="settings-form-grid">
            <label className="settings-field">
              <span>Full Name</span>

              <input
                type="text"
                value={draft.profileName}
                onChange={(event) =>
                  updateField(
                    "profileName",
                    event.target.value
                  )
                }
                placeholder="Enter your full name"
              />
            </label>

            <label className="settings-field">
              <span>Email Address</span>

              <input
                type="email"
                value={draft.email}
                onChange={(event) =>
                  updateField(
                    "email",
                    event.target.value
                  )
                }
                placeholder="name@example.com"
              />
            </label>

            <label className="settings-field settings-field-full">
              <span>Company / Workspace</span>

              <input
                type="text"
                value={draft.companyName}
                onChange={(event) =>
                  updateField(
                    "companyName",
                    event.target.value
                  )
                }
                placeholder="Workspace name"
              />
            </label>
          </div>
        </article>

        <article className="settings-panel">
          <div className="settings-panel-title">
            <div className="settings-panel-icon">
              <FaPalette />
            </div>

            <div>
              <h3>Workspace Experience</h3>
              <p>
                Control layout density and dashboard behavior.
              </p>
            </div>
          </div>

          <SettingToggle
            checked={draft.compactMode}
            onChange={(value) =>
              updateField("compactMode", value)
            }
            label="Compact dashboard mode"
            description="Reduce spacing and display more information on screen."
          />

          <SettingToggle
            checked={draft.soundEffects}
            onChange={(value) =>
              updateField("soundEffects", value)
            }
            label="Interface sounds"
            description="Enable subtle sounds for alerts and AI actions."
          />
        </article>

        <article className="settings-panel">
          <div className="settings-panel-title">
            <div className="settings-panel-icon">
              <FaBell />
            </div>

            <div>
              <h3>Notifications</h3>
              <p>
                Choose which business events should notify you.
              </p>
            </div>
          </div>

          <SettingToggle
            checked={draft.stockAlerts}
            onChange={(value) =>
              updateField("stockAlerts", value)
            }
            label="Stock risk alerts"
            description="Notify when a product reaches low or critical stock."
          />

          <SettingToggle
            checked={draft.forecastAlerts}
            onChange={(value) =>
              updateField("forecastAlerts", value)
            }
            label="Forecast alerts"
            description="Notify when demand or revenue risk changes."
          />

          <SettingToggle
            checked={draft.emailNotifications}
            onChange={(value) =>
              updateField(
                "emailNotifications",
                value
              )
            }
            label="Email notifications"
            description="Receive important inventory alerts through email."
          />
        </article>

        <article className="settings-panel">
          <div className="settings-panel-title">
            <div className="settings-panel-icon">
              <FaBrain />
            </div>

            <div>
              <h3>AI Copilot</h3>
              <p>
                Configure how SmartStock AI assists you.
              </p>
            </div>
          </div>

          <SettingToggle
            checked={draft.aiSuggestions}
            onChange={(value) =>
              updateField("aiSuggestions", value)
            }
            label="AI prompt suggestions"
            description="Show recommended questions and quick business actions."
          />

          <label className="settings-field">
            <span>Forecast refresh interval</span>

            <select
              value={draft.forecastRefresh}
              onChange={(event) =>
                updateField(
                  "forecastRefresh",
                  Number(event.target.value)
                )
              }
            >
              <option value={5}>Every 5 minutes</option>
              <option value={15}>
                Every 15 minutes
              </option>
              <option value={30}>
                Every 30 minutes
              </option>
              <option value={60}>Every hour</option>
            </select>
          </label>
        </article>

        <article className="settings-panel settings-panel-wide">
          <div className="settings-panel-title">
            <div className="settings-panel-icon">
              <FaShieldHalved />
            </div>

            <div>
              <h3>Inventory Rules</h3>
              <p>
                Configure thresholds used by your inventory
                engine.
              </p>
            </div>
          </div>

          <div className="settings-form-grid">
            <label className="settings-field">
              <span>Low-stock threshold</span>

              <input
                type="number"
                min="1"
                max="1000"
                value={draft.lowStockThreshold}
                onChange={(event) =>
                  updateField(
                    "lowStockThreshold",
                    Number(event.target.value)
                  )
                }
              />

              <small>
                Products below this quantity will be marked as
                low stock.
              </small>
            </label>

            <label className="settings-field">
              <span>Currency</span>

              <select
                value={draft.currency}
                onChange={(event) =>
                  updateField(
                    "currency",
                    event.target.value
                  )
                }
              >
                <option value="INR">
                  Indian Rupee — ₹
                </option>

                <option value="USD">
                  US Dollar — $
                </option>

                <option value="EUR">Euro — €</option>

                <option value="GBP">
                  British Pound — £
                </option>
              </select>
            </label>
          </div>
        </article>
      </div>

      <div className="settings-danger-zone">
        <div>
          <h3>Reset workspace preferences</h3>

          <p>
            Restore all SmartStock settings to their default
            values.
          </p>
        </div>

        <button
          type="button"
          className="settings-reset-button"
          onClick={resetSettings}
        >
          <FaRotateLeft />
          Reset Defaults
        </button>
      </div>
    </section>
  );
}

export { DEFAULT_SETTINGS };
export default SettingsPage;