// src/components/ThemeSwitcher.tsx

type Theme = "light" | "dark" | "emerald";

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
          onClick={() => {
            console.log(t);
            setTheme(t);
          }}
          className={`p-3 rounded-md text-xs border border-secondary/40 transition font-bold font-sans
            ${theme === t ? " bg-violet-50/80 text-black transform scale-115" : "bg-violet-50/40"}`}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}
