import { S3Client } from "@aws-sdk/client-s3"

if (!process.env.R2_ACCESS_KEY || !process.env.R2_SECRET_KEY || !process.env.R2_ACCOUNT_ID) {
  throw new Error("R2 Credentials not found")
}

const client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_BUCKET_URL,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
})

export { client }
