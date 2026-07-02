import { useEffect } from "react";
import useThemeStore from "../stores/useThemeStore";

/**
 * ThemeProvider — Syncs the Zustand theme store with the <html> element's class.
 * Supports "light", "dark", and "system" (auto-detect via prefers-color-scheme).
 */
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;

    const apply = (mode: "light" | "dark") => {
      root.classList.remove("light", "dark");
      root.classList.add(mode);
    };

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      apply(mq.matches ? "dark" : "light");

      const handler = (e: MediaQueryListEvent) =>
        apply(e.matches ? "dark" : "light");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }

    apply(theme);
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;
