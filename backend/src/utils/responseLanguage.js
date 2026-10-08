const SUPPORTED_LANGUAGES = new Set([
  "English",
  "Hindi",
  "Bengali",
  "Marathi",
  "Punjabi",
  "Tamil",
  "Telugu",
]);

function normalizeResponseLanguage(value) {
  return SUPPORTED_LANGUAGES.has(value) ? value : "English";
}

module.exports = { normalizeResponseLanguage };
