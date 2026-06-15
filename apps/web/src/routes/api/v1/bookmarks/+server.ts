import { json, text } from "@sveltejs/kit"
import z from "zod"
import { PUBLIC_WORKER_URL } from "$env/static/public"
import { requireUser } from "$lib/auth"
import { db } from "$lib/prisma"
import { fetchBookmarkMetadata } from "$lib/server/fetchBookmarkMetadata"
import { BookmarkUncheckedCreateInputObjectSchema } from "$lib/types/zod.js"
import type { RequestHandler } from "./$types"

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
              OR: [
                { title: { search } },
                { url: { search } },
                { desc: { search } },
              ],
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
      return { ...bookmark, tags: bookmark.tags.map((tag: LoadBookmark["tags"][number]) => tag.tag) }
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
    const { id, update } = await event.request.json()

    const data = await db.bookmark.update({
      data: {
        ...update,
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
    return new Response(String(error), { status: 401 })
  }
}

// Create Bookmark(s)
export const POST: RequestHandler = async (event) => {
  try {
    const { userId } = requireUser(event)
    const inputData = await event.request.json()
    const data = z.array(BookmarkUncheckedCreateInputObjectSchema).parse(inputData)

    const bookmarkData = await Promise.all(
      data.map(async (bookmark) => {
        const { imageUrl, imageBlur, metadata } = await fetchBookmarkMetadata(bookmark.url)
        return {
          ...bookmark,
          userId,
          image: imageUrl,
          imageBlur,
          desc: metadata.description,
          title: metadata.title ?? metadata.description,
          metadata,
        }
      })
    )

    const upsertResponse = await db.bookmark.createManyAndReturn({
      data: bookmarkData,
      skipDuplicates: true,
    })

    // Add bookmark to queue for fetching screenshot
    if (PUBLIC_WORKER_URL) {
      await event.fetch(`${PUBLIC_WORKER_URL}/v1/bookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: event.request.headers.get("cookie") ?? "",
        },
        body: JSON.stringify({
          data: bookmarkData.filter((bookmark) => !bookmark.image),
        }),
      })
    }

    return json({ data: upsertResponse, bookmarkData, count: upsertResponse.length })
  } catch (error) {
    console.error(String(error))
    return new Response(String(error))
  }
}

export const fallback: RequestHandler = async ({ request }) => {
  return text(`Invalid method ${request.method}`)
}
