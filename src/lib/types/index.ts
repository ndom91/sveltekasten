import z from "zod"

export const ScrollerTypes = {
  BOOKMARKS: "BOOKMARKS",
  FEEDS: "FEEDS",
} as const

const bookmarkFlatTagsSchema = z.object({
  id: z.string(),
  title: z.string().nullish(),
  url: z.string(),
  image: z.string().nullish(),
  imageBlur: z.string().nullish(),
  desc: z.string().nullish(),
  categoryId: z.string().nullish(),
  metadata: z.object({}),
  archived: z.boolean(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),

  category: z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullish(),
      userId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
    .nullish(),

  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      userId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  ),
})

export type BookmarkFlatTags = z.infer<typeof bookmarkFlatTagsSchema>
