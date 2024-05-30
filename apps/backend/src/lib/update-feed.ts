import parser from "@rowanmanning/feed-parser"
import { db } from "../plugins/prisma.js"
import debugFactory from "./log.js"
import type { Feed } from "./types/zod/index.js"

const debug = debugFactory("backend:update-feed")

const updateFeed = async (feed: Feed) => {
  const response = await fetch(feed.url, {
    headers: {
      "If-Modified-Since": feed.lastFetched?.toISOString() ?? "",
      "User-Agent": "BriefButler/1.0 (+https://github.com/ndom91/briefkastenhq)",
      "Accept-Encoding": "gzip",
    },
  })

  if (response.status === 304) {
    debug(`Feed not modified since last fetch - ${feed.url}`)
    return
  }
  const xml = await response.text()
  const parsedFeed = parser(xml)

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
  debug(`New Items: ${newItems.map(item => item.title).join(",")}`)

  // If no new items, return
  if (!newItems.length) {
    debug.info(`No new items to update in parsed feed: ${feed.url}`)
    return
  }

  // If we have new items to insert, insert their FeedEntry and FeedEntryMedia
  await Promise.all(
    newItems.map((item) => {
      debug.info(`Inserting ${item.url}`)
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
          categories: item.categories.map(category => category.label).filter(Boolean) as string[],
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

export { updateFeed }
