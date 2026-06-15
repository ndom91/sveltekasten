import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { getUserId } from "../../lib/auth.js"
import { actions } from "../../lib/constants.js"
import { screenshotQueue } from "../../plugins/queue.js"
import { bookmarkImageBodyValidator, bookmarkImageCookieValidator } from "./schema.js"

const api = new Hono()

api.post("/", bookmarkImageCookieValidator, bookmarkImageBodyValidator, async (c) => {
  const userId = await getUserId(c)

  try {
    const body = c.req.valid("json")

    for (const bookmark of body.data) {
      void screenshotQueue
        .push({
          action: actions.ADD_SCREENSHOT,
          data: {
            url: bookmark.url,
            userId,
          },
        })
        .catch((error) => console.error(error))
    }

    return c.text("Queued", 202)
  } catch (error) {
    console.error(error)
    throw new HTTPException(500, { message: String(error) })
  }
})

export default api
