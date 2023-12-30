import { preprocessMeltUI, sequence } from "@melt-ui/pp"
import adapter from "@sveltejs/adapter-auto"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

/** @type {import('@sveltejs/kit').Config}*/
const config = {
  preprocess: sequence([vitePreprocess(), preprocessMeltUI()]),
  kit: {
    adapter: adapter(),
    alias: {
      $: "src",
      $stores: "src/stores",
      $assets: "src/lib/assets",
      $lib: "src/lib",
      $zod: "src/lib/prismaTypes",
    },
  },
  // vitePlugin: {
  //   inspector: true,
  // },
}
export default config
