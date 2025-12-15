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
        background: "transparent", // Ensure background is transparent as requested
      },
    },
  },
  plugins: [],
} satisfies Config;
