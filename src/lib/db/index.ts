import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"
import { dev } from "$app/environment"
import { env } from "$env/dynamic/private"

import * as auth from "./schema/auth"
import * as bookmarks from "./schema/bookmarks"
import * as rss from "./schema/rss"

const db = drizzle(
  createClient({
    url: dev ? env.DATABASE_URL_LOCAL : env.DATABASE_URL_PROD,
    authToken: dev ? "" : env.DATABASE_AUTH_TOKEN,
  }),
  {
    schema: {
      ...auth,
      ...bookmarks,
      ...rss,
    },
  },
)

export { db }
