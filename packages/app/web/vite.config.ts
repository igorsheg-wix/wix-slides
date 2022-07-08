import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths({ projects: ["../../../tsconfig.json"] })],
  build: {
    outDir: "dist",
    sourcemap: true,
    manifest: true,
    rollupOptions: {
      input: {
        main: "src/main.tsx",
      },
    },
  },
});
