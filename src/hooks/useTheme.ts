// src/hooks/useTheme.ts
import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "emerald";

const STORAGE_KEY = "theme";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "emerald";
  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "light" || stored === "dark" || stored === "emerald") {
    return stored;
  }
  return "emerald";
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return { theme, setTheme };
}
