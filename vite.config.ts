import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"

export default defineConfig({
  // @ts-expect-error
  plugins: [sveltekit()],
  host: "0.0.0.0",
})
