import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8100", // Backend server URL
        changeOrigin: true,              // Changes the origin of the host header to the target URL
        secure: false,                   // For development, allows self-signed certificates if your backend uses HTTPS
      },
    },
  },
  plugins: [react()],
});
