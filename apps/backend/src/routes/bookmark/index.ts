import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { getCookie } from "hono/cookie"
import { timing, setMetric, startTime, endTime } from "hono/timing"

import { verifyJwt } from "../../lib/jwt.js"
import { bookmarkImageCookieValidator, bookmarkImageFormValidator } from "./schema.js"
import { client } from "../../plugins/storage.js"
import { PutObjectCommand } from "@aws-sdk/client-s3"

const api = new Hono()

api.use(timing())

api.post("/", bookmarkImageCookieValidator, bookmarkImageFormValidator, async (c) => {
  try {
    startTime(c, "auth")
    const cookieName = process.env.NODE_ENV !== "production" ? "authjs.session-token" : "__Secure-authjs.session-token"
    const cookie = getCookie(c, cookieName)!
    const decodedJwt = await verifyJwt(cookie)
    const userId = decodedJwt?.sub
    endTime(c, "auth")

    startTime(c, "parseUrl")
    const body = await c.req.parseBody()

    const image = body.image as File
    const url = new URL(body.url as string)
    const cleanUrl = `${url.hostname}${url.pathname.replace(/\/$/, "")}`
    const extension = image.type.split("/")[1]
    endTime(c, "parseUrl")
    setMetric(c, "url", url.toString())

    if (!image || !url || !userId) {
      throw new HTTPException(400, { message: "Missing required fields" })
    }

    startTime(c, "playwright")
    // TODO: Screenshot URL
    endTime(c, "playwright")

    startTime(c, "upload")
    const putCommand = new PutObjectCommand({
      ACL: "public-read",
      Bucket: "briefkasten-dev",
      Key: `${userId}/${cleanUrl.replaceAll("/", "_")}.${extension}`,
      Metadata: {
        userId,
        url: url.toString(),
      },
      // @ts-expect-error - ArrayBuffer works just fine..
      Body: await image.arrayBuffer(),
      ContentType: image.type,
      ContentLength: image.size,
    })

    const uploadResponse = await client.send(putCommand)
    endTime(c, "upload")

    return c.json(uploadResponse)
  } catch (error) {
    console.error(error)
    throw new HTTPException(500, { message: String(error) })
  }
})

export default api
