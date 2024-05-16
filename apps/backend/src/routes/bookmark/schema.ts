import { z } from "zod"
import { zValidator } from "@hono/zod-validator"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]

const bookmarkImageSchema = z.object({
  data: z.array(
    z
      .object({
        url: z
          .string({
            required_error: "URL is required.",
          })
          .url(),
        // image: z
        //   .any()
        //   .optional()
        //   .refine((file) => file?.size <= MAX_FILE_SIZE, { message: `Max file size is 5MB.` })
        //   .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
        //     message: ".jpg, .jpeg, .png and .webp files are accepted.",
        //   }),
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
