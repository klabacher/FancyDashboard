// src/components/ThemeSwitcher.tsx
import type { Theme } from "../hooks/useTheme";

type Props = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const THEMES: Theme[] = ["light", "dark", "emerald"];

export function ThemeSwitcher({ theme, setTheme }: Props) {
  return (
    <div className="flex items-center gap-2">
      {THEMES.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setTheme(t)}
          className={`px-3 py-1 rounded-full text-xs border border-secondary/40 transition
            ${theme === t ? "bg-primary text-bg" : "bg-bg text-text hover:bg-secondary/20"}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
