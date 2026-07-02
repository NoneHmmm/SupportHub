import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "../libs/i18n";

export type Language = "en" | "vi" | "system";

/** Resolve "system" to an actual language code based on browser preference */
export function resolveSystemLanguage(): "en" | "vi" {
  const navLang = navigator.language?.slice(0, 2);
  return navLang === "vi" ? "vi" : "en";
}

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "system",
      setLanguage: (lang: Language) => {
        const effective = lang === "system" ? resolveSystemLanguage() : lang;
        i18n.changeLanguage(effective);
        set({ language: lang });
      },
    }),
    {
      name: "language-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          const effective =
            state.language === "system"
              ? resolveSystemLanguage()
              : state.language;
          i18n.changeLanguage(effective);
        }
      },
    },
  ),
);

export default useLanguageStore;
