import { zValidator } from "@hono/zod-validator"
import { z } from "zod"

const bookmarkImageSchema = z.object({
  data: z.array(
    z
      .object({
        url: z
          .string({
            required_error: "URL is required.",
          })
          .url(),
      })
      .passthrough(),
  ),
})

const cookieName
  = process.env.NODE_ENV !== "production"
    ? "authjs.session-token"
    : "__Secure-authjs.session-token"

const bookmarkCookieSchema = z.object({
  [cookieName]: z.string({
    required_error: "Authentication required",
  }),
})

export const bookmarkImageCookieValidator = zValidator(
  "cookie",
  bookmarkCookieSchema,
)

export const bookmarkImageBodyValidator = zValidator(
  "json",
  bookmarkImageSchema,
)
