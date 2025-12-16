import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
        secondary: colors.purple,
        accent: colors.pink,
        success: colors.emerald,
        warning: colors.amber,
        error: colors.rose,
        background: "transparent",
        // Spatial Glass color palette
        glass: {
          light: "rgba(255, 255, 255, 0.05)",
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          dark: "rgba(0, 0, 0, 0.20)",
          frost: "rgba(24, 24, 27, 0.30)",
          surface: "rgba(39, 39, 42, 0.40)",
        },
      },
      backdropBlur: {
        "3xl": "40px",
        "4xl": "64px",
      },
      boxShadow: {
        // Spatial Glass shadows - deep and diffuse
        "glass-sm": "0 4px 16px 0 rgba(0, 0, 0, 0.25)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-lg": "0 16px 48px 0 rgba(0, 0, 0, 0.45)",
        "glass-xl": "0 24px 64px 0 rgba(0, 0, 0, 0.55)",
        // Inner glow for glass edges
        "glass-inner": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
        "glass-glow": "0 0 40px 0 rgba(255, 255, 255, 0.05)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      animation: {
        "glass-shimmer": "shimmer 2s linear infinite",
        float: "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      transitionTimingFunction: {
        glass: "cubic-bezier(0.4, 0, 0.2, 1)",
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
    },
  },
  plugins: [],
} satisfies Config;
