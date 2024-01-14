import { z } from "zod"

export const formSchema = z.object({
  title: z.string({ required_error: "A title is required" }).min(2).max(100),
  url: z.string({ required_error: "A URL is required" }).url().max(100),
  description: z.string().min(3).max(500).optional(),
  categoryId: z.string().min(2).max(50).optional(),
  tagIds: z.string().min(2).max(500).optional(),
  // tagIds: z.array(z.string().min(2).max(50)).optional(),
})

export type FormSchema = typeof formSchema
