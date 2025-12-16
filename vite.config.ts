import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [tsconfigPaths(), react(), tailwindcss()],
  clearScreen: false,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@Components": path.resolve(__dirname, "./src/Components"),
      "@Pages": path.resolve(__dirname, "./src/Pages"),
      "@Store": path.resolve(__dirname, "./src/Store"),
      "@State": path.resolve(__dirname, "./src/State"),
      "@Assets": path.resolve(__dirname, "./src/Assets"),
      "@Utils": path.resolve(__dirname, "./src/Utils"),
      "@Types": path.resolve(__dirname, "./src/Types"),
      "@__tests__": path.resolve(__dirname, "./src/__tests__"),
    },
  },
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
