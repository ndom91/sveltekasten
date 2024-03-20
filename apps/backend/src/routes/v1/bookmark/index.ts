import { Hono } from "hono"
import { getCookie } from "hono/cookie"
import { verifyJwt } from "../../../lib/jwt.js"
import { bookmarkImageCookieValidator, bookmarkImageFormValidator } from "./schema.js"
import { client } from "../../../plugins/storage.js"
import { PutObjectCommand } from "@aws-sdk/client-s3"

const api = new Hono()

api.post("/", bookmarkImageCookieValidator, bookmarkImageFormValidator, async (c) => {
  try {
    const decodedJwt = await verifyJwt(getCookie(c, "authjs.session-token")!)
    const userId = decodedJwt?.sub

    const body = await c.req.parseBody()

    const image = body.image as File
    const url = new URL(body.url as string)
    const cleanUrl = `${url.hostname}${url.pathname.replace(/\/$/, "")}`
    console.log({ cleanUrl })
    const extension = image.type.split("/")[1]

    if (!image || !url || !userId) {
      throw c.json({ error: "Missing required fields" }, 400)
    }

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

    return c.json(uploadResponse)
  } catch (error) {
    console.log(error)
    return c.json({ error }, 500)
  }
})

export default api
