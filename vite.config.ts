import { sveltekit } from "@sveltejs/kit/vite"
import { execSync } from "node:child_process"
import { defineConfig } from "vite"

const VCS_SHA = (process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA)!

export default defineConfig(({ mode }) => {
  let commitHash: string
  if (mode === "development") {
    commitHash = execSync("git rev-parse HEAD").toString().trimEnd()
  } else {
    commitHash = VCS_SHA
  }

  return {
    plugins: [sveltekit()],
    host: "0.0.0.0",
    define: {
      __VER__: JSON.stringify(commitHash.substring(0, 7)),
    },
  }
})
