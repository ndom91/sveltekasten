import { sveltekit } from "@sveltejs/kit/vite"
import { execSync } from "node:child_process"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ command, mode }) => {
  // const env = loadEnv(mode, process.cwd(), "")
  // console.log("env", env)

  const commitHash = execSync("git rev-parse HEAD").toString().trimEnd()

  return {
    plugins: [sveltekit()],
    build: {
      rollupOptions: {
        external: ["@auth/*"],
      },
    },
    define: {
      __VER__: JSON.stringify(commitHash.substring(0, 7)),
    },
  }
})
