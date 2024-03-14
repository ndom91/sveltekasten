import { z } from "zod"

export const formSchema = z.object({
  title: z.string({ required_error: "A title is required" }).min(2).max(100),
  url: z.string({ required_error: "A URL is required" }).url().max(100),
  description: z.string().max(500).optional().default(""),
  categoryId: z.string().max(50).optional().default(""),
  tags: z.array(
    z.object({
      id: z.string().cuid(),
      name: z.string(),
      userId: z.string().min(2).max(50),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  ),
})

export type FormSchema = typeof formSchema
