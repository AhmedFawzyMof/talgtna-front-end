import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import legacy from "@vitejs/plugin-legacy";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ["defaults", "not IE 11"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Talgtna | تالجتنا",
        short_name: "Talgtna | تالجتنا",
        description: "Best place to buy frozen food",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/talgtna/img/192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/talgtna/img/512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/talgtna/img/512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
