import prisma from "$lib/prisma"
import { db } from "$lib/db"
import { feed, feedEntry, feedEntryMedia } from "$lib/db/schema/rss"
import { desc, and, eq, count } from "drizzle-orm"
import { fail } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
// import type { Feed } from "$zod"

export const load: PageServerLoad = async ({ parent, locals, url }) => {
  await parent()
  try {
    const session = await locals.auth()
    if (session?.user?.userId) {
      // return fail(401, { type: "error", error: "Unauthenticated" })
      const skip = Number(url.searchParams.get("skip") ?? "0")
      const limit = Number(url.searchParams.get("limit") ?? "10")

      if (limit > 100) {
        return fail(401, { type: "error", error: "Attempted to load too many items" })
      }

      const feedEntryData = await db.query.feedEntry.findMany({
        with: {
          feed: true,
          feedMedia: true,
        },
        where: (feedEntry, { eq }) => eq(feedEntry.userId, session.user.userId),
        orderBy: (feedEntry) => desc(feedEntry.published),
        limit,
        offset: skip,
      })

      const feedEntryCount = await db
        .select({ value: count(feedEntry.id) })
        .from(feedEntry)
        .where(eq(feedEntry.userId, session.user.userId))

      // const dynamicQuery = db
      //   .select({
      //     id: feedEntries.id,
      //     guid: feedEntries.guid,
      //     text: feedEntries.text,
      //     link: feedEntries.link,
      //     content: feedEntries.content,
      //     contentSnippet: feedEntries.contentSnippet,
      //     author: feedEntries.author,
      //     ingested: feedEntries.ingested,
      //     published: feedEntries.published,
      //     unread: feedEntries.unread,
      //     feedId: feedEntries.feedId,
      //     feed: {
      //       id: feed.id,
      //       name: feed.name,
      //       url: feed.url,
      //       description: feed.description,
      //       language: feed.language,
      //       lastFetched: feed.lastFetched,
      //     },
      //     media: {
      //       id: feedEntryMedia.id,
      //       href: feedEntryMedia.href,
      //       title: feedEntryMedia.title,
      //       height: feedEntryMedia.height,
      //       width: feedEntryMedia.width,
      //       description: feedEntryMedia.description,
      //       feedEntryId: feedEntryMedia.feedEntryId,
      //     },
      //   })
      //   .from(feedEntries)
      //   .leftJoin(feed, eq(feedEntries.feedId, feed.id))
      //   .leftJoin(feedEntryMedia, eq(feedEntryMedia.feedEntryId, feedEntries.id))
      //   .where(eq(feedEntries.userId, session?.user?.userId))
      //   .orderBy(desc(feedEntries.published))
      //   .$dynamic()
      //
      // withPagination(dynamicQuery, skip)

      // const [feedEntryData, feedEntryCount] = await prisma.feedEntry.findManyAndCount({
      //   take: limit + skip,
      //   skip: skip,
      //   where: { userId: session?.user?.userId },
      //   include: {
      //     feed: true,
      //     feedMedia: true,
      //   },
      //   orderBy: { published: "desc" },
      // })

      const feedData = await db.query.feed.findMany({
        where: (feed, { eq }) => eq(feed.userId, session.user.userId),
        orderBy: (feeds) => desc(feeds.createdAt),
        limit,
        offset: skip,
      })

      const feedCount = await db
        .select({
          id: feed.id,
          name: feed.name,
          url: feed.url,
          description: feed.description,
          language: feed.language,
          lastFetched: feed.lastFetched,
          createdAt: feed.createdAt,
          updatedAt: feed.updatedAt,
          count: count(feed.id),
          feedEntryCount: count(feedEntry.id),
        })
        .from(feed)
        .leftJoin(feedEntry, eq(feedEntry.feedId, feed.id))
        .where(eq(feed.userId, session.user.userId))
        .orderBy(desc(feed.createdAt))

      // const [feedData, feedCount] = await prisma.feed.findManyAndCount({
      //   where: { userId: session?.user?.userId },
      //   select: {
      //     id: true,
      //     name: true,
      //     url: true,
      //     description: true,
      //     language: true,
      //     userId: true,
      //     lastFetched: true,
      //     createdAt: true,
      //     updatedAt: true,
      //     _count: {
      //       select: {
      //         feedEntries: { where: { unread: true } },
      //       },
      //     },
      //   },
      //   orderBy: { createdAt: "desc" },
      // })

      return {
        feedEntries: {
          data: feedEntryData,
          count: feedEntryCount,
        },
        feeds: {
          data: feedData.map((feed) => {
            return {
              ...feed,
              visible: true,
            } as unknown as Feed & { visible: boolean }
          }),
          count: feedCount,
        },
      }
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
