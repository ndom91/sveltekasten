import { z } from "zod"
import { zValidator } from "@hono/zod-validator"

const schema = z.object({
  feedUrl: z.string().url(),
})

export const feedBodySchema = zValidator("json", schema)
