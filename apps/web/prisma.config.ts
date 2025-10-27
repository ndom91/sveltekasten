import path from "node:path"
// import { PrismaNeon } from "@prisma/adapter-neon"
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  engine: "js",
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  // experimental: {
  //   adapter: true,
  // },
  // async adapter() {
  //   return new PrismaNeon({ connectionString: env("DATABASE_URL") })
  // },
  datasource: {
    directUrl: env("DIRECT_URL"),
    url: env("DATABASE_URL"),
  },
})

// generator client {
//   provider        = "prisma-client"
//   previewFeatures = ["fullTextSearchPostgres"]
//   output          = "../src/prisma-client"
//   engineType      = "client"
// }
//
// generator zod {
//   provider   = "prisma-zod-generator"
//   pureModels = true
// }
