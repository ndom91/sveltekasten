import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"

import { actions } from "../../lib/constants.js"
import { screenshotQueue } from "../../plugins/queue.js"
import { getUserId } from "../../lib/auth.js"
import {
  bookmarkImageBodyValidator,
  bookmarkImageCookieValidator,
} from "./schema.js"

const api = new Hono()

api.post(
  "/",
  bookmarkImageCookieValidator,
  bookmarkImageBodyValidator,
  async (c) => {
    const userId = await getUserId(c)

    try {
      const body = c.req.valid("json")

      await Promise.all(
        body.data.map((bookmark) => {
          return screenshotQueue.push({
            action: actions.ADD_SCREENSHOT,
            data: {
              url: bookmark.url,
              userId,
            },
          })
        }),
      )

      return c.text("Success")
    } catch (error) {
      console.error(error)
      throw new HTTPException(500, { message: String(error) })
    }
  },
)

export default api
