import { fail, redirect } from "@sveltejs/kit"
import { db } from "$lib/prisma"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ locals, url }) => {
  const session = await locals?.auth()

  if (!session && url.pathname !== "/login") {
    const fromUrl = url.pathname + url.search
    redirect(303, `/login?redirectTo=${encodeURIComponent(fromUrl)}`)
  }

  try {
    if (!session?.user?.id) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }

    const [feedData, feedCount] = await db.feedEntry.findManyAndCount({
      take: 10,
      skip: 0,
      where: {
        userId: session?.user?.id,
        unread: true,
      },
      include: {
        feed: true,
        feedMedia: true,
      },
      orderBy: { createdAt: "desc" },
    })

    const [bookmarkData, bookmarkCount] = (await db.bookmark.findManyAndCount({
      take: 10,
      skip: 0,
      where: {
        userId: session?.user?.id,
        archived: false,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    })) as unknown as [LoadBookmark[], number]

    return {
      feedEntries: {
        data: feedData,
        count: feedCount,
      },
      bookmarks: {
        data: bookmarkData,
        count: bookmarkCount,
      },
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    return { bookmarks: [], count: 0, error }
  }
}
