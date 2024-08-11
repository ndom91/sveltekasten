import { fail, redirect } from "@sveltejs/kit"
import { isAuthenticated } from "$/lib/auth"
import { db } from "$lib/prisma"
import type { Actions, PageServerLoad } from "./$types"
import { PUBLIC_WORKER_URL } from "$env/static/public"

export const actions: Actions = {
  deleteFeed: async (event) => {
    const session = await isAuthenticated(event)

    const data = await event.request.formData()
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
  addFeed: async (event) => {
    if (!PUBLIC_WORKER_URL) {
      return fail(500, { type: "error", error: "Worker URL Not Configured!" })
    }
    try {
      await isAuthenticated(event)
      const data = await event.request.formData()
      const feedUrl = String(data.get("feedUrl"))

      if (!feedUrl) {
        return fail(400, { type: "error", message: "Feed URL Required" })
      }

      const feedRes = await fetch(`${PUBLIC_WORKER_URL}/v1/feed`, {
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

      return { type: "success", message: "Adding Feed" }
    } catch (error) {
      console.error(String(error))

      return {
        type: "error",
        error,
      }
    }
  },
}

export const load: PageServerLoad = async (event) => {
  try {
    const session = await isAuthenticated(event)
    if (!session && event.url.pathname !== "/login") {
      const fromUrl = event.url.pathname + event.url.search
      redirect(303, `/login?redirectTo=${encodeURIComponent(fromUrl)}`)
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

    const [bookmarkData, bookmarkCount] = (await db.bookmark.findManyAndCount({
      where: {
        userId: session?.user?.id,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    })) as unknown as [LoadBookmark[], number]

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
