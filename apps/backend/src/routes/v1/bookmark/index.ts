import { Hono } from "hono"
import { getCookie } from "hono/cookie"
import { verifyJwt } from "../../../lib/jwt.js"
import { bookmarkSchema } from "./schema.js"
import { client } from "../../../plugins/storage.js"
import { PutObjectCommand } from "@aws-sdk/client-s3"

const api = new Hono()

api.post("/", bookmarkSchema, async (c) => {
  try {
    const decodedJwt = await verifyJwt(getCookie(c, "authjs.session-token")!)

    const { image, url } = c.req.valid("json")

    if (!image || !decodedJwt?.sub) {
      throw c.json({ error: "image required" }, 400)
    }

    const isBufferExists = typeof Buffer !== "undefined"
    const putCommand = new PutObjectCommand({
      ACL: "public-read",
      Bucket: process.env.R2_BUCKET,
      Key: `${new URL(url).hostname}-${new Date().getTime()}.${image.extension}`,
      Metadata: {
        userId: decodedJwt.sub,
        url: url,
      },
      Body: isBufferExists ? Buffer.from(await image.arrayBuffer()) : image,
      ContentType: image.type,
      ContentLength: image.size,
    })

    const uploadResponse = await client.send(putCommand)
    console.log("uploadResponse", uploadResponse)

    return c.json({ uploadResponse })
  } catch (error) {
    console.log(error)
    return c.json(error)
  }
})

export default api
