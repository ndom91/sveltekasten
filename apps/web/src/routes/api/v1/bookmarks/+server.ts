import z from "zod"
import { json, text } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { db } from "$lib/prisma"
import { BookmarkUncheckedCreateInputSchema } from "$lib/types/zod"
import { fetchBookmarkMetadata } from "$server/lib/fetchBookmarkMetadata"
import { WORKER_URL } from "$env/static/private"

// Get more Bookmarks
export const GET: RequestHandler = async ({ url, locals }) => {
  try {
    const session = await locals.auth()
    if (!session?.user?.id) {
      return new Response(null, { status: 401, statusText: "Unauthorized" })
    }
    const skip = Number(url.searchParams.get("skip") ?? "0")
    const limit = Number(url.searchParams.get("limit") ?? "10")

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
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    return new Response(String(error), { status: 401 })
  }
}

// Update Bookmark
export const PUT: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.auth()
    if (!session?.user?.id) {
      return new Response(null, { status: 401, statusText: "Unauthorized" })
    }
    const { id, update } = await request.json()

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
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    return new Response(String(error), { status: 401 })
  }
}

// Create Bookmark(s)
export const POST: RequestHandler = async ({ request, locals, fetch }) => {
  try {
    const session = await locals.auth()
    if (!session?.user?.id) {
      return new Response(null, { status: 401, statusText: "Unauthorized" })
    }
    const inputData = await request.json()
    const data = z.array(BookmarkUncheckedCreateInputSchema).parse(inputData)

    const bookmarkData = await Promise.all(
      data.map(async (bookmark) => {
        const { imageUrl, imageBlur, metadata } = await fetchBookmarkMetadata(bookmark.url)
        return {
          ...bookmark,
          image: imageUrl,
          imageBlur,
          desc: metadata.description,
          title: metadata.description,
          metadata,
        }
      }),
    )

    const upsertResponse = await db.bookmark.createMany({
      data: bookmarkData,
      skipDuplicates: true,
    })

    // Add bookmark to queue for fetching screenshot
    if (WORKER_URL) {
      await fetch(`${WORKER_URL}/bookmark`, {
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
