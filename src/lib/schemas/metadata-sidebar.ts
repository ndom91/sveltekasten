import { z } from "zod"

export const formSchema = z.object({
  title: z.string({ required_error: "A title is required" }).min(2).max(100),
  url: z.string({ required_error: "A URL is required" }).url().max(100),
  description: z.string().max(500).optional().default(""),
  // categoryId: z.string().min(2).max(50).optional().default(""),
  // tagIds: z.string().min(2).max(500).optional().default(""),
  category: z.string().min(2).max(50).optional().default(""),
  tags: z.string().min(2).max(500).optional().default(""),
})

// id: ui.metadataSidebarData.bookmark?.id,
// url: ui.metadataSidebarData.bookmark?.url,
// title: ui.metadataSidebarData.bookmark?.title,
// description: ui.metadataSidebarData.bookmark?.desc,
// category: ui.metadataSidebarData.bookmark?.category,
// tags: ui.metadataSidebarData.bookmark?.tags,

export type FormSchema = typeof formSchema
