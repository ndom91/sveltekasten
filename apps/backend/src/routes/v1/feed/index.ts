import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { feedBodySchema } from "./schema.js"
import { getCookie } from "hono/cookie"
import { verifyJwt } from "../../../lib/jwt.js"
import { parse } from "../../../lib/cookie.js"
import { actions } from "../../../lib/constants.js"
import { queue } from "../../../plugins/queue.js"

const api = new Hono()

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
    // TODO: Extract to reusable middleware
    const cookieName = process.env.NODE_ENV !== "production" ? "authjs.session-token" : "__Secure-authjs.session-token"
    // console.log("c.env.incoming", c.req.headers.get("authjs.session-token"))
    // console.log("c.req", c.req)
    // console.log("c.req.headers.raw", c.req.raw)
    // console.log("c.env", c.env)
    // console.log("c.env.incoming.rawHeaders", c.env.incoming.rawHeaders)
    console.log("cookieString", c.req.raw.headers.get("Cookie"))
    const cookies = parse(c.req.raw.headers.get("Cookie")!)
    console.log("cookiesObj", cookies)
    // let cookie
    // if (process.env.NODE_ENV !== "production") {
    //   cookie = getCookie(c, "authjs.session-token")
    // } else {
    //   cookie = getCookie(c, "authjs.session-token", "secure")
    // }
    const cookie = cookies[cookieName]
    const decodedJwt = await verifyJwt(cookie ?? "")

    console.log("debug.cookie", {
      env: process.env.NODE_ENV,
      cookieName: "authjs.session-token",
      cookie,
      decodedJwt,
    })

    const { feedUrl } = c.req.valid("json")

    if (!feedUrl || !decodedJwt?.sub) {
      throw new HTTPException(500, { message: "Failed to add feed, missing inputs" })
    }

    await queue.push({
      action: actions.ADD_FEED,
      data: {
        feedUrl,
        userId: decodedJwt.sub,
      },
    })
    return c.text("ok")
  } catch (error) {
    console.error(error)
    return c.json(error)
  }
})

export default api
