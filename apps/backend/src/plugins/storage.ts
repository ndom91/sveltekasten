import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

type UploadImageArgs = {
  image: Buffer
  url: URL
  userId: string
}

if (!process.env.BUCKET_ACCESS_KEY || !process.env.BUCKET_SECRET_KEY || !process.env.BUCKET_URL) {
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
  const cleanUrl = `${urlObj.hostname}${urlObj.pathname.replace(/\/$/, "")}`

  const key = `${userId}/${cleanUrl.replaceAll("/", "_")}.png`
  const putCommand = new PutObjectCommand({
    ACL: "public-read",
    Bucket: process.env.BUCKET_NAME ?? "briefkasten-dev",
    Key: key,
    Metadata: {
      userId,
      url: url.toString(),
    },
    Body: image,
    ContentType: "image/png",
    ContentLength: image.length,
  })

  await client.send(putCommand)

  // https://dev-img.briefkastenhq.com/cls57rev90000iw28cg9fl2nr%2Fcloudflare.com.png
  const imageUrl = `${process.env.BUCKET_PUBLIC_URL}/${key}`
  return imageUrl
}
