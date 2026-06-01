import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 1. Tell Vite that your built files live in this specific cPanel subdirectory
  base: "/mago-sms/mago-frontend/", 
  
  // 2. Keep the server block for local development so you can still work locally!
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});