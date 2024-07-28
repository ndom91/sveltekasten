import { isAuthenticated } from "$lib/auth"
import { db } from "$lib/prisma"
import { fetchBookmarkMetadata } from "$lib/server/fetchBookmarkMetadata"
import { BookmarkUncheckedCreateInputSchema } from "$lib/types/zod"
import { json, text } from "@sveltejs/kit"
import z from "zod"
import type { RequestHandler } from "./$types"
import { PUBLIC_WORKER_URL } from "$env/static/public"

// Get more Bookmarks
export const GET: RequestHandler = async (event) => {
  try {
    const session = await isAuthenticated(event)
    const skip = Number(event.url.searchParams.get("skip") ?? "0")
    const limit = Number(event.url.searchParams.get("limit") ?? "10")

    if (limit > 100) {
      return new Response(null, { status: 401, statusText: "Attempted to load too many items" })
    }

    const data = await db.bookmark.findMany({
      take: limit,
      skip,
      where: { userId: session?.user?.id },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return json({
      data,
    })
  } catch (error) {
    console.error(String(error))
    return new Response(String(error), { status: 401 })
  }
}

// Update Bookmark
export const PUT: RequestHandler = async (event) => {
  try {
    const session = await isAuthenticated(event)
    const { id, update } = await event.request.json()

    const data = await db.bookmark.update({
      data: {
        ...update,
      },
      where: {
        id,
        userId: session?.user?.id,
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
    const session = await isAuthenticated(event)
    const inputData = await event.request.json()
    const data = z.array(BookmarkUncheckedCreateInputSchema).parse(inputData)

    const bookmarkData = await Promise.all(
      data.map(async (bookmark) => {
        const { imageUrl, imageBlur, metadata } = await fetchBookmarkMetadata(bookmark.url)
        return {
          ...bookmark,
          userId: session.user.id!,
          image: imageUrl,
          imageBlur,
          desc: metadata.description,
          title: metadata.title ?? metadata.description,
          metadata,
        }
      }),
    )

    const upsertResponse = await db.bookmark.createManyAndReturn({
      data: bookmarkData,
      skipDuplicates: true,
    })

    // Add bookmark to queue for fetching screenshot
    if (PUBLIC_WORKER_URL) {
      await event.fetch(`${PUBLIC_WORKER_URL}/bookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: bookmarkData }),
      })
    }

    return json({ data: upsertResponse, bookmarkData })
  } catch (error) {
    console.error(String(error))
    return new Response(String(error))
  }
}

export const fallback: RequestHandler = async ({ request }) => {
  return text(`Invalid method ${request.method}`)
}
