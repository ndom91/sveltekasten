import { fail, redirect } from "@sveltejs/kit"
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
  try {
    const session = await locals.auth()
    if (!session && url.pathname !== "/login") {
      const fromUrl = url.pathname + url.search
      redirect(303, `/login?redirectTo=${encodeURIComponent(fromUrl)}`)
    }
    if (!session?.user?.userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
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

    const user = await prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        settings: true,
        createdAt: true,
      },
      where: {
        id: session?.user?.userId,
      },
    })

    console.log("server.settings.user", user)

    return {
      user,
      session,
      feeds: {
        data: feedData,
        count: feedCount,
      },
    }
  } catch (error: any) {
    return { feedEntries: [], count: 0, error: error.message ?? error }
  }
}
