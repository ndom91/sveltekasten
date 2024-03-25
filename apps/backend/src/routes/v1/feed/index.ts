import { Hono } from "hono"
// import { cors } from "hono/cors"
import { feedBodySchema } from "./schema.js"
import { getCookie } from "hono/cookie"
import { verifyJwt } from "../../../lib/jwt.js"
import { actions } from "../../../lib/constants.js"
import { queue } from "../../../plugins/queue.js"

const api = new Hono()
// TODO: reenable
// api.use("/v1/feed/*", cors({
//   origin: ['https://example.com', 'https://example.org'],
// }))

api.get("/", async (c) => {
  try {
    const queueList = queue.getQueue()

    return c.json({ queueList })
  } catch (e) {
    return c.json({ error: e }, 500)
  }
})

api.post("/", feedBodySchema, async (c) => {
  try {
    const cookieName = process.env.NODE_ENV !== "production" ? "authjs.session-token" : "__Secure-auth.session-token"
    const cookie = getCookie(c, cookieName)!
    const decodedJwt = await verifyJwt(cookie)
    console.log("cookie", { cookieName, cookie, decodedJwt })

    const { feedUrl } = c.req.valid("json")

    if (!feedUrl || !decodedJwt?.sub) {
      throw c.json({ error: "Failed to add feed, missing inputs" }, 500)
    }
    // TODO: Add to queue
    await queue.push({
      action: actions.ADD_FEED,
      data: {
        feedUrl,
        userId: decodedJwt.sub,
      },
    })
    return c.text("ok")
  } catch (error) {
    console.log(error)
    return c.json(error)
  }
})

export default api
