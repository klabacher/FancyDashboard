// src/components/ThemeSwitcher.tsx

// A simple Theme Switcher component

import {
  selectMainGrid,
  updateResizeConfig,
} from "@/store/Redux/MainGridSlice";
import { persistor } from "@store/Redux/Store";
import { useDispatch, useSelector } from "react-redux";

type Theme = "light" | "dark" | "emerald";

type Props = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const THEMES: Theme[] = ["light", "dark", "emerald"];

export function ThemeSwitcher({ theme, setTheme }: Props) {
  const dispatch = useDispatch();
  const { resizeConfig } = useSelector(selectMainGrid);
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
      <button
        type="button"
        className="p-3 rounded-md text-xs border border-red-400/40 transition font-bold font-sans bg-red-400/20 hover:bg-red-400/40"
        onClick={() => {
          persistor.flush();
          localStorage.clear();
          window.location.reload();
        }}
      >
        Reset App
      </button>
      <button
        type="button"
        className="p-3 rounded-md text-xs border border-red-400/40 transition font-bold font-sans bg-red-400/20 hover:bg-red-400/40"
        onClick={() => {
          // Toggle resize enable/disable
          // Dispatch action to toggle resize
          dispatch(updateResizeConfig(!resizeConfig.enabled));
        }}
      >
        Toggle Resize
      </button>
    </div>
  );
}
