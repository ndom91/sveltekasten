import { defineConfig } from "vite"
import { join } from "node:path"
import { sveltekit } from "@sveltejs/kit/vite"
import { partytownVite } from "@builder.io/partytown/utils"

export default defineConfig({
  plugins: [
    sveltekit(),
    partytownVite({
      dest: join(__dirname, "build", "client", "~partytown"),
    }),
  ],
  server: {
    host: "0.0.0.0",
  },
})
