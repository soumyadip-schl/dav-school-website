import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"), // ✅ since root is "client"
      "@shared": path.resolve(import.meta.dirname, "..", "shared"),
      "@assets": path.resolve(import.meta.dirname, "..", "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname), // 👈 this is already "client/"
  build: {
    outDir: path.resolve(import.meta.dirname, "..", "dist", "server", "public"), // ✅ KEY FIX
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
