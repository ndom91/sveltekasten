import { fail } from "@sveltejs/kit"
import prisma from "$lib/prisma"
import type { Actions } from "./$types"
import type { PageServerLoad } from "./$types"
import { WORKER_URL } from "$env/static/private"

export const actions: Actions = {
  deleteFeed: async ({ request, locals }) => {
    const session = await locals.auth()
    if (!session?.user?.userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const data = await request.formData()
    const feedId = String(data.get("feedId"))

    if (!feedId) {
      return fail(400, { type: "error", message: "Missing Feed ID" })
    }

    await prisma.feed.delete({
      where: {
        id: feedId,
        userId: session.user.userId,
      },
    })
    return { type: "success", message: "Deleted Feed" }
  },
  addFeed: async ({ fetch, request, locals }) => {
    if (!WORKER_URL) {
      return fail(500, { type: "error", error: "Worker URL Not Configured!" })
    }
    const session = await locals.auth()
    if (!session?.user?.userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const data = await request.formData()
    const feedUrl = String(data.get("feedUrl"))

    if (!feedUrl) {
      return fail(400, { type: "error", message: "Feed URL Required" })
    }

    await fetch(`${WORKER_URL}/v1/feed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        feedUrl,
        userId: session.user.userId,
      }),
    })

    return { type: "success", message: "Added Feed" }
  },
}

export const load: PageServerLoad = async ({ parent, locals, url }) => {
  await parent()
  try {
    const session = await locals.auth()
    if (!session?.user?.userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    // const skip = Number(url.searchParams.get("skip") ?? "0")
    const limit = Number(url.searchParams.get("limit") ?? "10")

    if (limit > 100) {
      return fail(401, { type: "error", error: "Attempted to load too many items" })
    }

    const [feedData, feedCount] = await prisma.feed.findManyAndCount({
      where: { userId: session?.user?.userId },
      select: {
        id: true,
        name: true,
        url: true,
        description: true,
        language: true,
        userId: true,
        lastFetched: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            feedEntries: { where: { unread: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return {
      feeds: {
        data: feedData,
        count: feedCount,
      },
    }
  } catch (error) {
    let message
    if (typeof error === "string") {
      message = error
    } else if (error instanceof Error) {
      message = error.message
    }
    return { feedEntries: [], count: 0, error: message }
  }
}
