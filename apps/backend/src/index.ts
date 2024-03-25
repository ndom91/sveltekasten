import { Hono } from "hono"
import { logger } from "hono/logger"
import { format } from "@formkit/tempo"
import { prettyJSON } from "hono/pretty-json"
import { updateJob } from "./jobs/cron-update.js"
import { serve, type HttpBindings } from "@hono/node-server"

import bookmark from "./routes/v1/bookmark/index.js"
import feed from "./routes/v1/feed/index.js"
import root from "./routes/root.js"

type Bindings = HttpBindings

const app = new Hono<{ Bindings: Bindings }>()
app.use(logger())
app.use(prettyJSON())

app.route("/v1/bookmark", bookmark)
app.route("/v1/feed", feed)
app.route("/", root)

app.get("*", (c) => c.notFound())

const port = process.env.PORT ? parseInt(process.env.PORT) : 8000

console.log(`
🚀 Server ready at: http://0.0.0.0:${port}
⌛ Next cron run at: ${format(updateJob.nextRun() ?? "", { date: "medium", time: "long" })}
`)

serve({
  fetch: app.fetch,
  port,
})
