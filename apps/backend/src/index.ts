import { Hono } from "hono"
import { logger } from "hono/logger"
import { format } from "@formkit/tempo"
import { prettyJSON } from "hono/pretty-json"
import { rateLimiter } from "hono-rate-limiter";
import { type HttpBindings, serve } from "@hono/node-server"

import { updateJob } from "./jobs/cron-update.js"
import bookmark from "./routes/bookmark/index.js"
import feed from "./routes/feed/index.js"
import root from "./routes/root.js"

const limiter = rateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 5, // Limit each IP to 100 requests per `window`
  standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  keyGenerator: (c) => {
    const a = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || c.req.header('origin') || '127.0.0.1' // Method to generate custom identifiers for clients.
    console.log('clientIp', a)
    return a
  }
});

const app = new Hono<{ Bindings: HttpBindings }>({ strict: false }).basePath(
  "/worker/v1",
)

app.use(logger())
app.use(prettyJSON())
app.use(limiter)

app.route("/bookmark", bookmark)
app.route("/feed", feed)
app.route("/", root)

app.get("*", c => c.notFound())

const port = process.env.PORT ? Number.parseInt(process.env.PORT) : 8000

console.log(`
🚀 Server ready at: http://0.0.0.0:${port}
⌛ Next cron run at: ${format(updateJob.nextRun() ?? "", { date: "medium", time: "long" })}
`)

serve({
  fetch: app.fetch,
  port,
})
