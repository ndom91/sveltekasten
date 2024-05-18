import type { Buffer } from "node:buffer"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

interface UploadImageArgs {
  image: Buffer
  url: string
  userId: string
}

if (
  !process.env.BUCKET_ACCESS_KEY
  || !process.env.BUCKET_SECRET_KEY
  || !process.env.BUCKET_URL
) {
  throw new Error("Object store credentials missing!")
}

export const client = new S3Client({
  region: "auto",
  endpoint: process.env.BUCKET_URL,
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.BUCKET_SECRET_KEY,
  },
})

export const uploadImage = async ({ image, url, userId }: UploadImageArgs) => {
  const urlObj = new URL(url)
  const cleanFilename = `${urlObj.hostname}${urlObj.pathname.replace(/\/$/, "").replaceAll("/", "_")}`

  const imagePath = `${userId}/${cleanFilename}.png`
  const putCommand = new PutObjectCommand({
    ACL: "public-read",
    Bucket: process.env.BUCKET_NAME ?? "briefkasten-dev",
    Key: imagePath,
    Metadata: {
      userId,
      url: url.toString(),
    },
    Body: image,
    ContentType: "image/png",
    ContentLength: image.length,
  })

  await client.send(putCommand)

  // i.e. https://dev-img.briefkastenhq.com/cls57rev90000iw28cg9fl2nr%2Fcloudflare.com.png
  return `${process.env.BUCKET_PUBLIC_URL}/${imagePath}`
}
