import Fastify from "fastify"
import { updateJob } from "@jobs/cron-update"
import autoLoad from "@fastify/autoload"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const fastify = Fastify({ logger: { level: "warn" } })
const _dirname = typeof __dirname === "undefined" ? dirname(fileURLToPath(import.meta.url)) : __dirname

fastify.register(autoLoad, {
  dir: join(_dirname, "routes"),
})

fastify.register(autoLoad, {
  dir: join(_dirname, "plugins"),
})
  ; (async function() {
    console.log("process.env.JWT_SECRET", process.env?.JWT_SECRET)
    console.log("config.JWT_SECRET", fastify.config?.JWT_SECRET)

    if (!fastify.config.JWT_SECRET) {
      console.error("JWT_SECRET not set")
      process.exit(1)
    }
    const port = process.env.PORT ? parseInt(process.env.PORT) : 8000
    try {
      console.log(`
🚀 Server ready at: http://0.0.0.0:${port}
⌛ Next cron run at: ${updateJob.nextRun()}
`)
      await fastify.listen({ port, host: "0.0.0.0" })
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  })()
