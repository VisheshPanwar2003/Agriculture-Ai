export const SUPPORTED_LANGUAGES = [
  "English",
  "Hindi",
  "Bengali",
  "Marathi",
  "Punjabi",
  "Tamil",
  "Telugu",
];

export const DEFAULT_PREFERENCES = {
  location: "Delhi",
  language: "English",
};

export function getPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem("preferences") || "{}");
    return {
      location: typeof saved.location === "string" && saved.location.trim()
        ? saved.location.trim()
        : DEFAULT_PREFERENCES.location,
      language: SUPPORTED_LANGUAGES.includes(saved.language)
        ? saved.language
        : DEFAULT_PREFERENCES.language,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(preferences) {
  const nextPreferences = {
    location: preferences.location.trim(),
    language: SUPPORTED_LANGUAGES.includes(preferences.language)
      ? preferences.language
      : DEFAULT_PREFERENCES.language,
  };

  localStorage.setItem("preferences", JSON.stringify(nextPreferences));
  window.dispatchEvent(new Event("preferences-updated"));
  return nextPreferences;
}
