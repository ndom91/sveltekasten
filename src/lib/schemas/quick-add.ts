import { z } from "zod"

export const formSchema = z.object({
  title: z.string({ required_error: "A title is required" }).min(2).max(100),
  url: z.string({ required_error: "A URL is required" }).url().max(100),
  description: z.string().max(500).optional().default(""),
  categoryId: z.string().max(50).optional().default(""),
  tagIds: z.string().max(500).optional().default(""),
})

export type FormSchema = typeof formSchema
