import { fetchFeed } from "./feed.js"
import debugFactory from "./log.js"
import { db } from "../plugins/prisma.js"
import type { Feed } from "./types/zod/index.js"

const debug = debugFactory("backend:update-feed")

export const updateFeed = async (feed: Feed) => {
  const parsedFeed = await fetchFeed({ url: feed.url, lastFetched: feed.lastFetched })
  if (!parsedFeed) {
    debug(`No feed data: ${feed.url}`)
    return
  }

  // Find pre-existing feed entries
  const matchedFeedEntries = await db.feedEntry.findMany({
    select: {
      guid: true,
    },
    where: {
      guid: {
        in: parsedFeed.items.map(item => item.id).filter(Boolean) as string[],
      },
      feedId: feed.id,
      userId: feed.userId,
    },
  })

  // Diff pre-existing feed entries and new feed parsed items
  const newItems = parsedFeed.items.filter(
    item => !matchedFeedEntries.some(entry => entry.guid === item.id),
  )

  // If no new items, return
  if (!newItems.length) {
    debug(`0 new items in ${feed.url}`)
    return
  }

  debug(`${newItems.length} new items ${feed.url}`)

  // If we have new items to insert, insert their FeedEntry and FeedEntryMedia
  await Promise.allSettled(
    newItems.map((item) => {
      debug(`Inserting ${item.url}`)
      return db.feedEntry.create({
        data: {
          title: item.title ?? "",
          guid: item.id,
          link: item.url ?? "",
          author: item.authors?.[0]?.name,
          content: item.content ?? item.description,
          contentSnippet: item.description,
          ingested: new Date().toISOString(),
          published: item.published,
          categories: item.categories.map(category => category.label).filter((label) => !label?.includes('|')).filter(Boolean) as string[],
          user: {
            connect: {
              id: feed.userId,
            },
          },
          feed: {
            connect: {
              id: feed.id,
            },
          },
          feedMedia: {
            create: item.media?.filter(media => media.type === "image" && !!media.title && !!media.url).map(media => ({
              href: media.url,
              title: media.title,
              user: {
                connect: {
                  id: feed.userId,
                },
              },
            }),
            ),
          },
        },
      })
    }),
  )
}
