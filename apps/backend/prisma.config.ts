import path from "node:path"
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  engine: "js",
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    directUrl: env("DIRECT_URL"),
    url: env("DATABASE_URL"),
  },
})
