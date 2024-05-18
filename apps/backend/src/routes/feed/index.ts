import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { getUserId } from "../../lib/auth.js"
import { actions } from "../../lib/constants.js"
import { feedQueue } from "../../plugins/queue.js"
import { feedBodySchema } from "./schema.js"

const api = new Hono()

api.get("/", async (c) => {
  try {
    const queueList = feedQueue.getQueue()

    return c.json({ queueList })
  } catch (error) {
    return c.json({ error }, 500)
  }
})

api.post("/", feedBodySchema, async (c) => {
  const userId = await getUserId(c)
  try {
    const { feedUrl } = c.req.valid("json")

    if (!feedUrl || !userId) {
      throw new HTTPException(500, {
        message: "Failed to add feed, missing inputs",
      })
    }

    await feedQueue.push({
      action: actions.ADD_FEED,
      data: {
        feedUrl,
        userId,
      },
    })
    return c.text("ok")
  } catch (error) {
    console.error(error)
    return c.json({ error }, 500)
  }
})

export default api
