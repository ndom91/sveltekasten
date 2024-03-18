import { Hono } from "hono"
// import { cors } from "hono/cors"
import { feedBodySchema } from "./schema.js"
// import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from "hono/cookie"
import { getCookie, getSignedCookie } from "hono/cookie"
import { verifyJwt } from "../../../lib/jwt.js"
import { actions } from "../../../lib/constants.js"
import { queue } from "../../../plugins/queue.js"

const api = new Hono()
// TODO: reenable
// api.use("/v1/feed/*", cors({
//   origin: ['https://example.com', 'https://example.org'],
// }))
const sessionToken = `eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiTi1NN0VheC1KZnZmc0NSNnhYRFpJbzE2ZE1FWE9vZkY5dzdPS1pxSFpuNHNUUEJRcFdTcHZrWVAxRWN4WkFaa0JPYmRNUzR4VXBrQkk1UzRBWU56X2cifQ..MPLPtsMIZXtoZhxbpvGscg.4iClekv9rVEfgU8ZPpLhJqUzxOSg7z-KF9haJXiRdALuPMMCttSzQUfzekTVOQ_fRHb9kEbFY84mAWftZii3bSvvWsW1RujoQq4yMd7nUbOzvEzSWdzcYi_TyBv6MQYnh_Fr9hFVlPEmDw24OaK-FhB4w7jLL4xkR9pcwRy9WK-R1S7PguUp5z27X7NWqu0ViCBKpJApfKXPXgvKsUlE4t3Ec00sCvhL4ud7eKwlHF6tHv15PoF979uaRVutCAsu9pZhf5GpZ9MCDKq4BiOZwPC4UIJHl7ezJ_92A_HAmlmQcaljdbkX9MTEKJPUvEq4R53TP_50AMBEKXkzpCudXmupBb808RSG5vAf7EPlfxe_5RSc63VgkQ8qVnTXD7gAgGqt8Ot7GcR_DpYVZNl3O1BVxiavn-jvPhvZXPPuzeokYPcuQQT0a_DbIG761yBjxJQXuz0RBnKuVy9SIaWGpic9E8qjlmd71o7Rl9YAtaVtRwN8kk7rslTPSZpFhu3iJfEP7d_Z1ZWMZkOU7uRY9g.tWgPUQwq1Bah0j2XPhqRyGMwFU0JE90KdfzzVFlVUfU`

api.get("/", async (c) => {
  // TODO: Get queue members
  // const queue = queue.getQueue()
  const queue = [
    { id: "aaaaaaaaaaaa", feedUrl: "https://techcrunch.com/feed" },
    { id: "bbbbbbbbbbbb", feedUrl: "https://engadget.com/feed" },
  ]

  try {
    const decodedJwt = await verifyJwt(getCookie(c, "authjs.session-token")!)
    console.log("post /v1/feed decodedJwt", decodedJwt)

    return c.json({ queue, decodedJwt })
  } catch (e) {
    return c.json({ error: e }, 500)
  }
})

api.post("/", feedBodySchema, async (c) => {
  const decodedJwt = await verifyJwt(getCookie(c, "authjs.session-token")!)

  try {
    const { feedUrl } = c.req.valid("json")

    if (!feedUrl || !decodedJwt?.sub) {
      throw c.json({ error: "feedUrl and userId required" }, 400)
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
