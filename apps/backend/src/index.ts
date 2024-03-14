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

;(async function () {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET not set")
    return
  }
  const port = process.env.PORT ? parseInt(process.env.PORT) : 8000
  try {
    await fastify.listen({ port, host: "0.0.0.0" })
    console.log(`
  🚀 Server ready at: http://0.0.0.0:${port}
  ⌛ Next cron run at: ${updateJob.nextRun()}
  `)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})()
