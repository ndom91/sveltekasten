import { requireUser } from "$/lib/auth"
import { db } from "$/lib/prisma"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async (event) => {
  const { userId } = requireUser(event, { redirectToLogin: true })

  try {
    const [feedData, feedCount] = await db.feedEntry.findManyAndCount({
      take: 10,
      skip: 0,
      where: {
        userId,
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
        userId,
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
