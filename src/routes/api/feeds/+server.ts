import type { RequestHandler } from "./$types"
import { json, fail } from "@sveltejs/kit"
import prisma from "$lib/prisma"

// Get FeedEntries
// @ts-expect-error
export const GET: RequestHandler = async ({ url, locals }) => {
  try {
    const session = await locals.getSession()
    if (!session?.user?.userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const skip = Number(url.searchParams.get("skip") ?? "0")
    const limit = Number(url.searchParams.get("limit") ?? "10")

    if (limit > 100) {
      return fail(401, { type: "error", error: "Attempted to load too many items" })
    }

    const data = await prisma.feedEntry.findMany({
      take: limit,
      skip: skip,
      where: { userId: session?.user?.userId },
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
    let message
    if (typeof error === "string") {
      message = error
    } else if (error instanceof Error) {
      message = error.message
    }
    return fail(401, { data: [], error: message })
  }
}

// Update FeedEntry
// @ts-expect-error
export const PUT: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.getSession()
    if (!session?.user?.userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const { feedEntry } = await request.json()

    const data = await prisma.feedEntry.update({
      data: {
        unread: feedEntry.unread,
      },
      where: {
        id: feedEntry.id,
        userId: session?.user?.userId,
      },
      include: {
        feed: true,
        feedMedia: true,
      },
    })

    return json({ data })
  } catch (error) {
    let message
    if (typeof error === "string") {
      message = error
    } else if (error instanceof Error) {
      message = error.message
    }
    return fail(401, { data: [], error: message })
  }
}
