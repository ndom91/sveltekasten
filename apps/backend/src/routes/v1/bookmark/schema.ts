import { z } from "zod"
import { zValidator } from "@hono/zod-validator"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const bookmarkImageSchema = z.object({
  url: z
    .string({
      required_error: "URL is required.",
    })
    .url(),
  image: z
    .any({
      required_error: "Image is required.",
    })
    .refine((file) => file?.size <= MAX_FILE_SIZE, { message: `Max file size is 5MB.` })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
      message: ".jpg, .jpeg, .png and .webp files are accepted.",
    }),
})

const bookmarkCookieSchema = z.object({
  "authjs.session-token": z.string({
    required_error: "Authentication required",
  }),
})

export const bookmarkImageCookieValidator = zValidator("cookie", bookmarkCookieSchema)
export const bookmarkImageFormValidator = zValidator("form", bookmarkImageSchema)
