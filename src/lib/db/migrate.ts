import { migrate } from "drizzle-orm/libsql/migrator"
import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"
import * as dotenv from "dotenv"
dotenv.config()

const isDev: boolean = process.env.NODE_ENV === "development"

async function main() {
  let dbUrl
  if (!process.env.DATABASE_URL_LOCAL || !process.env.DATABASE_URL_PROD) {
    throw new Error("Missing DATABASE_URL_LOCAL or DATABASE_URL_PROD")
  } else {
    dbUrl = isDev ? process.env.DATABASE_URL_LOCAL : process.env.DATABASE_URL_PROD
  }

  const db = drizzle(
    createClient({
      url: dbUrl,
      authToken: isDev ? "" : process.env.DATABASE_AUTH_TOKEN,
    }),
  )

  console.log("Running migrations")

  // await migrate(db, { migrationsFolder: "./migrations" })
  await migrate(db, { migrationsFolder: "./src/lib/db/migrations" })

  console.log("Migrated successfully")

  process.exit(0)
}

// main().catch((e) => {
//   console.error("Migration failed")
//   console.error(e)
//   process.exit(1)
// })

try {
  await main()
} catch (e) {
  console.error("Migration failed")
  console.error(e)
  process.exit(1)
}
