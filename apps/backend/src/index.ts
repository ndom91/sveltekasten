import { Hono } from "hono"
import { logger } from "hono/logger"
import { format } from "@formkit/tempo"
import { prettyJSON } from "hono/pretty-json"
import { rateLimiter } from "hono-rate-limiter";
import { type HttpBindings, serve } from "@hono/node-server"
import { getConnInfo } from '@hono/node-server/conninfo'


import { updateJob } from "./jobs/cron-update.js"
import bookmark from "./routes/bookmark/index.js"
import feed from "./routes/feed/index.js"
import root from "./routes/root.js"

const limiter = rateLimiter({
  windowMs: 1 * 60 * 1000, // 5 minutes
  limit: 5, // Limit each IP to 100 requests per `window`
  standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  keyGenerator: (c) => {
    const info = getConnInfo(c) // info is `ConnInfo`

    const a = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || c.req.header('origin') || '127.0.0.1'
    console.log('custom.cf-connecting', c.req.header('CF-Connecting-IP'))
    console.log('custom.xff', c.req.header('X-Forwarded-For'))
    console.log('custom.xrip', c.req.header('X-Real-IP'))
    console.log('custom.xfserver', c.req.header('X-Forwarded-Server'))
    console.log('custom.xfhost', c.req.header('X-Forwarded-Host'))
    console.log('custom.origin', c.req.header('origin'))
    console.log('custom.a', a)
    console.log('connInfo', info.remote.address)
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
