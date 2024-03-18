import { Hono } from "hono"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import { updateJob } from "./jobs/cron-update.js"
import type { HttpBindings } from "@hono/node-server"
import { getLogger } from "./plugins/logger.js"

const wLogger = getLogger({ prefix: "app" })

import feed from "./routes/v1/feed/index.js"
import root from "./routes/root.js"

type Bindings = HttpBindings

const app = new Hono<{ Bindings: Bindings }>()
app.use(logger())
app.use(prettyJSON())

app.route("/v1/feed", feed)
app.route("/", root)

app.get("*", (c) => c.notFound())

const port = process.env.PORT ? parseInt(process.env.PORT) : 8000

wLogger.info(`Starting at 0.0.0.0:${port}`)

console.log(`
🚀 Server ready at: http://0.0.0.0:${port}
⌛ Next cron run at: ${updateJob.nextRun()}
`)

// Node
// serve({
//   fetch: app.fetch,
//   port,
// })

// Bun
export default {
  fetch: app.fetch,
  port,
}
