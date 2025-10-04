import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

const CURRENT_VERSION = "1.5";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Talagtna | تالجتنا",
        short_name: "Talagtna | تالجتنا",
        start_url: "/?v=1.5",
        description: "Best place to buy frozen food",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        icons: [
          {
            src: "/talgtna/img/new-192.png?v=1.5",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/talgtna/img/new-512.png?v=1.5",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/talgtna/img/new-512.png?v=1.5",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        runtimeCaching: [],

        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,

        navigationPreload: false,
      },
      filename: `sw-nocache-v${CURRENT_VERSION}.js`,
      injectRegister: "auto",
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
