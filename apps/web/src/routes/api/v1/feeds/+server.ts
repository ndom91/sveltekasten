import { json, text } from "@sveltejs/kit"
import { isAuthenticated } from "$/lib/auth"
import { db } from "$lib/prisma"
import type { RequestHandler } from "./$types"

// Get FeedEntries
export const GET: RequestHandler = async (event) => {
  try {
    const session = await isAuthenticated(event)
    const skip = Number(event.url.searchParams.get("skip") ?? "0")
    const limit = Number(event.url.searchParams.get("limit") ?? "10")

    if (limit > 100) {
      return new Response(null, { status: 401, statusText: "Attempted to load too many items" })
    }

    const data = await db.feedEntry.findMany({
      take: limit,
      skip,
      where: { userId: session?.user?.id },
      include: {
        feed: true,
        feedMedia: true,
      },
      orderBy: { published: "desc" },
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

// Update FeedEntry
export const PUT: RequestHandler = async (event) => {
  try {
    const session = await isAuthenticated(event)
    const { feedEntry } = await event.request.json()

    const data = await db.feedEntry.update({
      data: {
        unread: feedEntry.unread,
      },
      where: {
        id: feedEntry.id,
        userId: session?.user?.id,
      },
      include: {
        feed: true,
        feedMedia: true,
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

export const fallback: RequestHandler = async ({ request }) => {
  return text(`Invalid method ${request.method}`)
}
