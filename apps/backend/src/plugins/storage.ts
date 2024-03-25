import { S3Client } from "@aws-sdk/client-s3"

if (!process.env.BUCKET_ACCESS_KEY || !process.env.BUCKET_SECRET_KEY || !process.env.BUCKET_URL) {
  throw new Error("Object store credentials missing!")
}

const client = new S3Client({
  region: "auto",
  endpoint: process.env.BUCKET_URL,
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.BUCKET_SECRET_KEY,
  },
})

export { client }
