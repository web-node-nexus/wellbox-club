import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
    proxy: {
      "/api/2factor": {
        target: "https://2factor.in",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/2factor/, "/API/V1"),
        secure: true,
      },
    },
  },
});
