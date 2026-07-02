import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import useThemeStore, { type Theme } from "../../stores/useThemeStore";
import { cn } from "../../libs/cn";

// ── Inline SVG icons ──

const SunIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2" />
    <path d="M12 21v2" />
    <path d="M4.22 4.22l1.42 1.42" />
    <path d="M18.36 18.36l1.42 1.42" />
    <path d="M1 12h2" />
    <path d="M21 12h2" />
    <path d="M4.22 19.78l1.42-1.42" />
    <path d="M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const MonitorIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <path d="M8 21h8" />
    <path d="M12 17v4" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── Theme options ──

const THEME_OPTIONS: Theme[] = ["light", "dark", "system"];

const THEME_ICONS: Record<Theme, (props: { className?: string }) => React.ReactNode> = {
  light: SunIcon,
  dark: MoonIcon,
  system: MonitorIcon,
};

// ── Props ──

interface ThemeToggleProps {
  /** "dropdown" renders a dropdown menu with light/dark/system options (default).
   *  "toggle" renders a simple button that cycles light ↔ dark. */
  variant?: "dropdown" | "toggle";
  className?: string;
}

// ── Component ──

const ThemeToggle = ({ variant = "dropdown", className }: ThemeToggleProps) => {
  const { theme, setTheme, toggleTheme } = useThemeStore();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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

  // ── Toggle variant: single button ──
  if (variant === "toggle") {
    const Icon = theme === "dark" ? MoonIcon : SunIcon;
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          "flex cursor-pointer items-center justify-center rounded-md p-1.5 text-notion-text-tertiary hover:bg-notion-surface-hover hover:text-notion-text transition-colors",
          className,
        )}
        aria-label="Toggle theme"
      >
        <Icon className="size-4" />
      </button>
    );
  }

  // ── Dropdown variant ──
  const CurrentIcon = THEME_ICONS[theme];
  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center cursor-pointer rounded-md p-1.5 text-notion-text-tertiary transition-colors hover:bg-notion-surface-hover hover:text-notion-text"
        aria-label="Select theme"
      >
        <CurrentIcon className="size-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-35 rounded-lg border border-notion-border bg-notion-bg p-1 shadow-notion-md">
          {THEME_OPTIONS.map((option) => {
            const OptionIcon = THEME_ICONS[option];
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setTheme(option);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors my-0.5 cursor-pointer",
                  option === theme
                    ? "bg-notion-blue-bg text-notion-blue-text"
                    : "text-notion-text-secondary hover:bg-notion-surface-hover hover:text-notion-text",
                )}
              >
                <OptionIcon className="size-4" />
                <span>{t(`theme.${option}`)}</span>
                {option === theme && (
                  <CheckIcon className="ml-auto size-3.5" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
