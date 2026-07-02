import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import useLanguageStore, { type Language } from "../../stores/useLanguageStore";
import { cn } from "../../libs/cn";

const LANGUAGE_OPTIONS: Language[] = ["en", "vi", "system"];

const LANGUAGE_LABELS: Record<Language, { short: string; full: string }> = {
  en: { short: "EN", full: "English" },
  vi: { short: "VI", full: "Tiếng Việt" },
  system: { short: "AU", full: "" }, // full key is translated via i18n
};

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const selectedLabel =
    language === "system"
      ? LANGUAGE_LABELS.system.short
      : LANGUAGE_LABELS[language].short;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-notion-text-tertiary transition-colors hover:bg-notion-surface-hover hover:text-notion-text"
        aria-label="Select language"
      >
        {selectedLabel}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-37.5 rounded-lg border border-notion-border bg-notion-bg p-1 shadow-notion-md">
          {LANGUAGE_OPTIONS.map((option) => {
            const label =
              option === "system"
                ? t("theme.system")
                : LANGUAGE_LABELS[option].full;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setLanguage(option);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors my-0.5 cursor-pointer",
                  option === language
                    ? "bg-notion-blue-bg text-notion-blue-text"
                    : "text-notion-text-secondary hover:bg-notion-surface-hover hover:text-notion-text",
                )}
              >
                <span className="flex size-5 items-center justify-center rounded border border-notion-border text-[10px] font-semibold uppercase text-notion-text-tertiary">
                  {LANGUAGE_LABELS[option].short}
                </span>
                <span>{label}</span>
                {option === language && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-auto size-3.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
