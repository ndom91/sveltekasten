// import adapter from "@sveltejs/adapter-node"
import adapter from "svelte-adapter-bun"
import * as child_process from "node:child_process"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      precompress: true,
      dynamic_origin: true,
      xff_depth: 1,
    }),
    version: {
      name: child_process.execSync("git rev-parse HEAD").toString().trim().substring(0, 7),
    },
    alias: {
      $: "src",
      $stores: "src/stores",
      $assets: "src/lib/assets",
      $schemas: "src/lib/schemas",
      $server: "src/server",
      $lib: "src/lib",
      $state: "src/state",
    },
  },
}

export default config
