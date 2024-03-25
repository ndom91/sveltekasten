import { Hono } from "hono"
import { logger } from "hono/logger"
import { format } from "@formkit/tempo"
import { prettyJSON } from "hono/pretty-json"
import { updateJob } from "./jobs/cron-update.js"
import { serve, type HttpBindings } from "@hono/node-server"

import bookmark from "./routes/bookmark/index.js"
import feed from "./routes/feed/index.js"
import root from "./routes/root.js"

type Bindings = HttpBindings

const app = new Hono<{ Bindings: Bindings }>({ strict: false }).basePath('/api/v0')
app.use(logger())
app.use(prettyJSON())

app.route("/bookmark", bookmark)
app.route("/feed", feed)
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
