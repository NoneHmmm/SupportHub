import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import vi from "../locales/vi.json";

/**
 * Resolve the effective language:
 * - If stored value is "system" or missing → detect from navigator.language
 * - Otherwise use the stored value directly
 */
function resolveLanguage(): string {
  try {
    const raw = localStorage.getItem("language-storage");
    if (raw) {
      const parsed = JSON.parse(raw);
      const state = parsed?.state;
      if (state?.language && state.language !== "system") {
        return state.language;
      }
    }
  } catch {
    // ignore parse errors
  }

  // Fall back to browser detection
  const navLang = navigator.language?.slice(0, 2);
  return navLang === "vi" ? "vi" : "en";
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
  lng: resolveLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes
  },
});

export default i18n;
