import { defineConfig } from "drizzle-kit"
import * as dotenv from "dotenv"
dotenv.config()

const isDev: boolean = process.env.NODE_ENV === "development"

const config = {
  schema: "./src/lib/db/schema/*",
  out: "./src/lib/db/migrations",
  driver: isDev ? "libsql" : "turso",
  dbCredentials: {
    url: process.env[isDev ? "DATABASE_URL_LOCAL" : "DATABASE_URL_LOCAL"],
  },
  verbose: true,
  strict: true,
}

if (isDev) {
  config.dbCredentials.authToken = process.env.DATABASE_AUTH_TOKEN
}

export default defineConfig(config)
