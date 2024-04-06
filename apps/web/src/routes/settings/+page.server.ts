import { fail, redirect } from "@sveltejs/kit"
import { db } from "$lib/prisma"
import type { PageServerLoad, Actions } from "./$types"
import { WORKER_URL } from "$env/static/private"

export const actions: Actions = {
  deleteFeed: async ({ request, locals }) => {
    const session = await locals.auth()
    if (!session?.user?.id) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const data = await request.formData()
    const feedId = String(data.get("feedId"))

    if (!feedId) {
      return fail(400, { type: "error", message: "Missing Feed ID" })
    }

    await db.feed.delete({
      where: {
        id: feedId,
        userId: session.user.id,
      },
    })
    return { type: "success", message: "Deleted Feed" }
  },
  addFeed: async ({ fetch, request, locals }) => {
    if (!WORKER_URL) {
      return fail(500, { type: "error", error: "Worker URL Not Configured!" })
    }
    try {
      const session = await locals.auth()
      if (!session?.user?.id) {
        return fail(401, { type: "error", error: "Unauthenticated" })
      }
      const data = await request.formData()
      const feedUrl = String(data.get("feedUrl"))

      if (!feedUrl) {
        return fail(400, { type: "error", message: "Feed URL Required" })
      }

      const feedRes = await fetch(`${WORKER_URL}/feed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedUrl,
        }),
      })
      if (!feedRes.ok) {
        return fail(500, { type: "error", error: "Failed to add feed" })
      }

      return { type: "success", message: "Added Feed" }
    } catch (error) {
      console.error(String(error))

      return {
        type: "error",
        error,
      }
    }
  },
}

export const load: PageServerLoad = async ({ locals, url }) => {
  try {
    const session = await locals.auth()
    if (!session && url.pathname !== "/login") {
      const fromUrl = url.pathname + url.search
      redirect(303, `/login?redirectTo=${encodeURIComponent(fromUrl)}`)
    }
    if (!session?.user?.id) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }

    const [feedData, feedCount] = await db.feed.findManyAndCount({
      where: { userId: session?.user?.id },
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

    const [bookmarkData, bookmarkCount] = await db.bookmark.findManyAndCount({
      where: {
        userId: session?.user?.id,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const bookmarksFlatTags = bookmarkData.map((bookmark) => {
      return { ...bookmark, tags: bookmark.tags.map((tag) => tag.tag) }
    })

    const user = await db.user.findUnique({
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
        id: session?.user?.id,
      },
    })

    return {
      user,
      session,
      feeds: {
        data: feedData,
        count: feedCount,
      },
      bookmarks: {
        data: bookmarksFlatTags,
        count: bookmarkCount,
      },
    }
  } catch (error) {
    console.error(String(error))

    return {
      bookmarks: { count: 0, data: [] },
      feedEntries: { count: 0, data: [] },
      error,
    }
  }
}
