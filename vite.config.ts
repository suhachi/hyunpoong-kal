import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "현풍닭칼국수 주문/포장 웹앱",
        short_name: "현풍닭칼국수",
        description: "현풍닭칼국수 공식 주문/포장 전용 PWA입니다.",
        theme_color: "#B62020",
        background_color: "#FFFFFF",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        navigateFallback: "/index.html",
        // Firebase 관련 파일 제외 (선택 사항)
      },
    }),
  ],
  publicDir: "public",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    outDir: "dist",
  },
  server: {
    port: 3000,
    open: true,
    strictPort: false,
  },
});
