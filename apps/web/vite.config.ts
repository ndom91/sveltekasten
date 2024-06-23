import { defineConfig } from "vite"
import { SvelteKitPWA } from "@vite-pwa/sveltekit"
import { join } from "node:path"
import { sveltekit } from "@sveltejs/kit/vite"
import { partytownVite } from "@builder.io/partytown/utils"

export default defineConfig({
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      // strategies: "injectManifest",
      filename: "service-worker.ts",
      srcDir: "src",
      injectRegister: false,
      manifest: false,
      injectManifest: {
        injectionPoint: undefined,
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
