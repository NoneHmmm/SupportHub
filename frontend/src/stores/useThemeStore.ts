import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme: Theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => {
          // Resolve the effective theme, respecting "system" preference
          const resolve = (t: Theme): "light" | "dark" => {
            if (t !== "system") return t;
            return window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light";
          };
          const current = resolve(state.theme);
          return { theme: current === "light" ? "dark" : "light" };
        }),
    }),
    {
      name: "theme-storage",
    },
  ),
);

export default useThemeStore;
