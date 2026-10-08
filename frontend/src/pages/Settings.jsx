import { useState } from "react";
import { Check, Globe2, KeyRound, MapPin, Save, UserRound } from "lucide-react";
import api from "../services/api";
import { getPreferences, savePreferences, SUPPORTED_LANGUAGES } from "../services/preferences";
import { useTranslation } from "../services/i18n";

const LOCATION_OPTIONS = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Jaipur",
  "Lucknow",
  "Ahmedabad",
  "Bhopal",
  "Chandigarh",
  "Dehradun",
];

function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function Settings() {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState(getPreferences);
  const [locationChoice, setLocationChoice] = useState(() => {
    const location = getPreferences().location;
    return LOCATION_OPTIONS.includes(location) ? location : "Other";
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const user = getSavedUser();

  const updatePreference = (key, value) => {
    setPreferences((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!preferences.location.trim()) {
      setError("Enter a location to personalize your local weather.");
      setSaved(false);
      return;
    }

    try {
      setPreferences(savePreferences(preferences));
      setSaved(true);
      setError("");
    } catch {
      setError("Could not save preferences in this browser. Check its storage settings.");
      setSaved(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (passwords.newPassword.length < 8) {
      setPasswordError(t("New password must be at least 8 characters."));
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError(t("New password and confirmation do not match."));
      return;
    }

    try {
      setPasswordSaving(true);
      const response = await api.post("/auth/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      if (response.data.token) localStorage.setItem("token", response.data.token);
      setPasswordMessage(t(response.data.detail || "Password changed successfully."));
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (requestError) {
      setPasswordError(t(
        requestError.response?.data?.detail ||
        requestError.response?.data?.error ||
        (requestError.request
          ? "Could not reach the server. Check your connection and try again."
          : requestError.message) ||
        "Unable to change password. Please try again."
      ));
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-8">
      <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#12271a] via-[#0b1b13] to-[#0a1812] p-5 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">{t("Your workspace")}</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{t("Settings")}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{t("Personalize local conditions and the language used for AI-generated farming guidance.")}</p>
      </section>

      <section className="rounded-3xl border border-white/[0.08] bg-[#0b1b13] p-5 sm:p-7">
        <div className="flex items-start gap-3 border-b border-white/[0.07] pb-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-emerald-300"><UserRound size={19} /></span>
          <div>
            <h3 className="font-semibold text-white">{t("Account")}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{t("Signed-in profile details for this account.")}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{t("Name")}</p>
            <p className="mt-2 truncate text-sm font-medium text-slate-100">{user?.name || "Not available"}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{t("Email")}</p>
            <p className="mt-2 truncate text-sm font-medium text-slate-100">{user?.email || "Not available"}</p>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-white/[0.08] bg-[#0b1b13] p-5 sm:p-7">
        <div className="flex items-start gap-3 border-b border-white/[0.07] pb-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-300"><Globe2 size={19} /></span>
          <div>
            <h3 className="font-semibold text-white">{t("Regional preferences")}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{t("These preferences are saved in this browser and used across your workspace.")}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="preferred-location" className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200"><MapPin size={15} className="text-emerald-300" /> {t("Location in India")} <span className="text-rose-300">*</span></label>
            <select
              id="preferred-location"
              required
              value={locationChoice}
              onChange={(event) => {
                const nextLocation = event.target.value;
                setLocationChoice(nextLocation);
                if (nextLocation === "Other") {
                  setPreferences((current) => ({ ...current, location: LOCATION_OPTIONS.includes(current.location) ? "" : current.location }));
                  setSaved(false);
                } else {
                  updatePreference("location", nextLocation);
                }
              }}
              className="w-full rounded-xl border border-white/10 bg-[#07140f] px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-300/10"
            >
              {LOCATION_OPTIONS.map((location) => <option key={location} value={location}>{location}</option>)}
              <option value="Other">{t("Other city…")}</option>
            </select>
            {locationChoice === "Other" && (
              <input
                required
                maxLength={80}
                value={preferences.location}
                onChange={(event) => updatePreference("location", event.target.value)}
                placeholder={t("Enter your city")}
                className="mt-3 w-full rounded-xl border border-white/10 bg-[#07140f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-300/10"
              />
            )}
            <span className="mt-2 block text-xs leading-relaxed text-slate-500">{t("Used to show local weather in the navigation panel.")}</span>
          </div>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200"><Globe2 size={15} className="text-emerald-300" /> {t("AI response language")} <span className="text-rose-300">*</span></span>
            <select
              required
              value={preferences.language}
              onChange={(event) => updatePreference("language", event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#07140f] px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-300/10"
            >
              {SUPPORTED_LANGUAGES.map((language) => <option key={language} value={language}>{t(language)}</option>)}
            </select>
            <span className="mt-2 block text-xs leading-relaxed text-slate-500">{t("Used for chatbot, crop analysis, and almanac AI guidance.")}</span>
          </label>
        </div>

        {error && <p role="alert" className="mt-5 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-200">{t(error)}</p>}
        {saved && <p role="status" className="mt-5 flex items-center gap-2 text-sm text-emerald-300"><Check size={16} /> {t("Preferences saved.")}</p>}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">{t("Changes take effect immediately.")}</p>
          <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 py-2.5 text-sm font-semibold text-[#082016] transition hover:bg-emerald-200 focus-visible:outline-offset-2">
            <Save size={16} /> {t("Save preferences")}
          </button>
        </div>
      </form>

      <form onSubmit={handlePasswordSubmit} className="rounded-3xl border border-white/[0.08] bg-[#0b1b13] p-5 sm:p-7">
        <div className="flex items-start gap-3 border-b border-white/[0.07] pb-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-300"><KeyRound size={19} /></span>
          <div>
            <h3 className="font-semibold text-white">{t("Change password")}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{t("Confirm your current password to choose a new one.")}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-200">{t("Current password")}</span>
            <input
              required
              type="password"
              autoComplete="current-password"
              value={passwords.currentPassword}
              onChange={(event) => setPasswords((current) => ({ ...current, currentPassword: event.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-[#07140f] px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-300/10"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">{t("New password")}</span>
            <input
              required
              minLength={8}
              type="password"
              autoComplete="new-password"
              value={passwords.newPassword}
              onChange={(event) => setPasswords((current) => ({ ...current, newPassword: event.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-[#07140f] px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-300/10"
            />
            <span className="mt-2 block text-xs text-slate-500">{t("Use at least 8 characters.")}</span>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">{t("Confirm new password")}</span>
            <input
              required
              minLength={8}
              type="password"
              autoComplete="new-password"
              value={passwords.confirmPassword}
              onChange={(event) => setPasswords((current) => ({ ...current, confirmPassword: event.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-[#07140f] px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-300/10"
            />
          </label>
        </div>

        {passwordError && <p role="alert" className="mt-5 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-200">{t(passwordError)}</p>}
        {passwordMessage && <p role="status" className="mt-5 flex items-center gap-2 text-sm text-emerald-300"><Check size={16} /> {t(passwordMessage)}</p>}

        <div className="mt-6 flex justify-end border-t border-white/[0.07] pt-5">
          <button type="submit" disabled={passwordSaving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 py-2.5 text-sm font-semibold text-[#082016] transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60">
            <KeyRound size={16} /> {passwordSaving ? "Updating…" : "Update password"}
          </button>
        </div>
      </form>
    </div>
  );
}
