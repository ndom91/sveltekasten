import { error as kitError, isHttpError, json, text } from "@sveltejs/kit"
import z from "zod"
import { PUBLIC_WORKER_URL } from "$env/static/public"
import { requireUser } from "$lib/auth"
import { db } from "$lib/prisma"
import { fetchBookmarkMetadata } from "$lib/server/fetchBookmarkMetadata"
import type { RequestHandler } from "./$types"

const bookmarkCreateInputSchema = z
  .object({
    title: z.string().optional().nullable(),
    url: z.string().url(),
    desc: z.string().optional().nullable(),
    categoryId: z.string().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    tags: z.array(z.string().min(1)).optional(),
  })
  .strict()

const bookmarkUpdateInputSchema = z
  .object({
    id: z.string().cuid(),
    update: z
      .object({
        archived: z.boolean(),
      })
      .strict(),
  })
  .strict()

// Get more Bookmarks
export const GET: RequestHandler = async (event) => {
  try {
    const { userId } = requireUser(event)
    const skip = Number(event.url.searchParams.get("skip") ?? "0")
    const limit = Number(event.url.searchParams.get("limit") ?? "10")
    const archived = event.url.searchParams.get("archived") === "true"
    const query = event.url.searchParams.get("q")?.trim()

    if (limit > 100) {
      return new Response(null, {
        status: 401,
        statusText: "Attempted to load too many items",
      })
    }

    const search = query ? query.split(/\s+/).join(" & ") : undefined

    const [data, count] = (await db.bookmark.findManyAndCount({
      take: limit,
      skip,
      where: {
        userId,
        archived,
        ...(search
          ? {
              OR: [{ title: { search } }, { url: { search } }, { desc: { search } }],
            }
          : {}),
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    })) as unknown as [LoadBookmark[], number]

    const bookmarks = data.map((bookmark) => {
      return {
        ...bookmark,
        tags: bookmark.tags.map((tag: LoadBookmark["tags"][number]) => tag.tag),
      }
    }) as LoadBookmarkFlatTags[]

    return json({
      data: bookmarks,
      count,
    })
  } catch (error) {
    console.error(String(error))
    return new Response(String(error), { status: 401 })
  }
}

// Update Bookmark
export const PUT: RequestHandler = async (event) => {
  try {
    const { userId } = requireUser(event)
    const { id, update } = bookmarkUpdateInputSchema.parse(await event.request.json())

    const data = await db.bookmark.update({
      data: {
        archived: update.archived,
      },
      where: {
        id,
        userId,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    })

    return json({ data })
  } catch (error) {
    console.error(String(error))
    return new Response(String(error), { status: error instanceof z.ZodError ? 400 : 401 })
  }
}

// Create Bookmark(s)
export const POST: RequestHandler = async (event) => {
  try {
    const { userId } = requireUser(event)
    const inputData = await event.request.json()
    const data = z.array(bookmarkCreateInputSchema).parse(inputData)

    const bookmarkData = await Promise.all(
      data.map(async (bookmark) => {
        if (bookmark.categoryId) {
          const category = await db.category.findFirst({
            where: {
              id: bookmark.categoryId,
              userId,
            },
            select: {
              id: true,
            },
          })

          if (!category) {
            kitError(400, { message: "Invalid category" })
          }
        }

        const { imageUrl, imageBlur, metadata } = await fetchBookmarkMetadata(bookmark.url)
        const tagNames = Array.from(
          new Set(bookmark.tags?.map((tag) => tag.trim()).filter(Boolean))
        )

        return {
          ...bookmark,
          tags: tagNames,
          userId,
          image: imageUrl,
          imageBlur,
          desc: bookmark.desc ?? metadata.description,
          title: bookmark.title ?? metadata.title ?? metadata.description,
          metadata,
        }
      })
    )

    const bookmarksByUrl = new Map<string, (typeof bookmarkData)[number]>()
    for (const bookmark of bookmarkData) {
      const existingBookmark = bookmarksByUrl.get(bookmark.url)
      bookmarksByUrl.set(
        bookmark.url,
        existingBookmark
          ? {
              ...existingBookmark,
              tags: Array.from(new Set([...existingBookmark.tags, ...bookmark.tags])),
            }
          : bookmark
      )
    }

    const uniqueBookmarkData = Array.from(bookmarksByUrl.values())
    const requestTagNames = Array.from(
      new Set(uniqueBookmarkData.flatMap((bookmark) => bookmark.tags))
    )
    if (requestTagNames.length) {
      await db.tag.createMany({
        data: requestTagNames.map((name) => ({
          name,
          userId,
        })),
        skipDuplicates: true,
      })
    }

    const upsertResponse = await Promise.all(
      uniqueBookmarkData.map(({ tags, ...bookmark }) => {
        return db.bookmark.upsert({
          where: {
            url_userId: {
              url: bookmark.url,
              userId,
            },
          },
          create: {
            ...bookmark,
            tags: tags.length
              ? {
                  create: tags.map((name) => ({
                    tag: {
                      connect: {
                        name_userId: {
                          name,
                          userId,
                        },
                      },
                    },
                  })),
                }
              : undefined,
          },
          update: {
            archived: false,
          },
          include: {
            category: true,
            tags: { include: { tag: true } },
          },
        })
      })
    )

    const bookmarks = upsertResponse.map((bookmark) => {
      return { ...bookmark, tags: bookmark.tags.map((tag) => tag.tag) }
    }) as LoadBookmarkFlatTags[]

    // Add bookmark to queue for fetching screenshot
    if (PUBLIC_WORKER_URL) {
      await event.fetch(`${PUBLIC_WORKER_URL}/v1/bookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: event.request.headers.get("cookie") ?? "",
        },
        body: JSON.stringify({
          data: upsertResponse
            .filter((bookmark) => !bookmark.image)
            .map((bookmark) => ({ url: bookmark.url })),
        }),
      })
    }

    return json({ data: bookmarks, count: bookmarks.length })
  } catch (error) {
    console.error(String(error))
    if (isHttpError(error)) {
      return new Response(error.body.message, { status: error.status })
    }

    return new Response(String(error), { status: error instanceof z.ZodError ? 400 : 500 })
  }
}

export const fallback: RequestHandler = async ({ request }) => {
  return text(`Invalid method ${request.method}`, { status: 405 })
}
