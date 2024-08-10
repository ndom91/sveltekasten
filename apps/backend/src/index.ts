import { format } from "@formkit/tempo"
import { type HttpBindings, serve } from "@hono/node-server"
import { Hono } from "hono"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import { rateLimiter } from "hono-rate-limiter";

import {
  createIPX,
  createIPXWebServer,
  ipxFSStorage,
  ipxHttpStorage,
} from 'ipx';
import { updateJob } from "./jobs/cron-update.js"
import bookmark from "./routes/bookmark/index.js"
import feed from "./routes/feed/index.js"
import root from "./routes/root.js"
// import { ipxHandler } from "./lib/imageProxy.js"


const ipx = createIPX({
  storage: ipxFSStorage(),
  httpStorage: ipxHttpStorage({
    allowAllDomains: true,
  }),
});

const limiter = rateLimiter({
  windowMs: 1 * 60 * 1000, // 5 minutes
  limit: 5, // Limit each IP to 100 requests per `window`
  standardHeaders: "draft-6",
  keyGenerator: (c) => {
    return c.req.header('X-Forwarded-For') || c.req.header('X-Real-IP') || c.req.header('CF-Connecting-IP') || '127.0.0.1'
  }
});

const app = new Hono<{ Bindings: HttpBindings }>().basePath(
  "/worker/v1",
)

app.use(logger())
app.use(prettyJSON())
if (process.env.NODE_ENV === "production") {
  app.use(limiter)
}
app.use("/*", c => createIPXWebServer(ipx)(c.req.raw))

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
