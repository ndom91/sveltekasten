import { defineConfig } from "vite"
import { SvelteKitPWA } from "@vite-pwa/sveltekit"
import { join } from "node:path"
import { sveltekit } from "@sveltejs/kit/vite"
import { partytownVite } from "@builder.io/partytown/utils"

export default defineConfig({
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      strategies: "injectManifest",
      filename: "service-worker.ts",
      srcDir: "src",
      manifest: {
        id: "briefbutler-2",
        name: "BriefButler",
        short_name: "BriefButler",
        description: "Bookmarks, and more!",
        theme_color: "#ffffff",
        share_target: {
          action: "/api/v1/bookmarks/share",
          method: "POST",
          enctype: "multipart/form-data",
          params: {
            url: "url",
          },
        },
        icons: [
          {
            src: "favicon/pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "favicon/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "favicon/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "favicon/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "screenshots/0_menu.webp",
            sizes: "470x1010",
            type: "image/webp",
            form_factor: "narrow",
            label: "Menu",
          },
          {
            src: "screenshots/1_dashboard.webp",
            sizes: "470x1010",
            type: "image/webp",
            form_factor: "narrow",
            label: "Dashboard",
          },
          {
            src: "screenshots/2_feed.webp",
            sizes: "470x1010",
            type: "image/webp",
            form_factor: "narrow",
            label: "Feed",
          },
          {
            src: "screenshots/app0-dark.png",
            sizes: "1720x1250",
            type: "image/png",
            form_factor: "wide",
            label: "Dashboard",
          },
          {
            src: "screenshots/app1-feed.png",
            sizes: "1720x1250",
            type: "image/png",
            form_factor: "wide",
            label: "Feed",
          },
        ],
      },
      injectManifest: {
        globPatterns: ["client/**/*.{js,css,ico,png,svg,webp,woff,woff2}"],
      },
      devOptions: {
        enabled: true,
        navigateFallback: "/",
        suppressWarnings: true,
        type: "module",
      },
    }),
    partytownVite({
      dest: join(__dirname, "build", "client", "~partytown"),
    }),
  ],
  server: {
    host: "0.0.0.0",
  },
})
