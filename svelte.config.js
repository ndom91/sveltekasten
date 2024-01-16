import adapter from "@sveltejs/adapter-auto"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    version: {
      name: process.env.npm_package_version,
    },
    alias: {
      $: "src",
      $stores: "src/stores",
      $assets: "src/lib/assets",
      $lib: "src/lib",
      $zod: "src/lib/types/prisma",
      $state: "src/state",
    },
  },
  vitePlugin: {
    inspector: true,
  },
}

export default config
