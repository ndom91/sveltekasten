// import { prisma } from "../plugins/db.js"
// import { db } from "@briefkasten/db"
import Parser from "rss-parser"
import { getLogger } from "../plugins/logger.js"
// import type { Feed } from "@briefkasten/db"
import type { Feed, FeedEntry } from "@briefkasten/db/types"

import { createRequire } from 'module';
const require = createRequire(import.meta.url ?? __filename);
const { db } = require('@briefkasten/db');

const wLogger = getLogger({ prefix: "update-feed" })

const parser = new Parser({
  defaultRSS: 2.0,
  customFields: {
    feed: ["language", "copyright"],
    item: [["media:content", "media", { keepArray: true }]],
  },
})

const updateFeed = async (feed: Feed) => {
  const response = await fetch(feed.url)
  const xml = await response.text()
  const { items } = await parser.parseString(xml)
  // const { items, ...parsedFeedMetadata } = parsedFeed
  // const { items } = parsedFeed

  // Get GUIDs of all items parsed from feed
  const itemGuids = items.map((item) => item.guid ?? "").filter(Boolean)

  // If no items in parsed feed, return
  if (!itemGuids.length) {
    wLogger.info(`No items in parsed feed: ${feed.url}`)
    return
  }

  // Find pre-existing feed entries
  const matchedFeedEntries: FeedEntry[] = await db.feedEntry.findMany({
    select: {
      guid: true,
    },
    where: {
      guid: {
        in: itemGuids,
      },
      feedId: feed.id,
      userId: feed.userId,
    },
  })

  // Diff pre-existing feed entries and new feed parsed items
  const newItems = items.filter((item) => !matchedFeedEntries.some((entry) => entry.guid === item.guid))
  wLogger.info(`New Items: ${newItems.map((item) => item.title)}`)

  // If no new items, return
  if (!newItems.length) {
    wLogger.info(`No new items to update in parsed feed: ${feed.url}`)
    return
  }

  // If we have new items to insert, insert their FeedEntry and FeedEntryMedia
  await Promise.all(
    newItems.map((item) => {
      wLogger.info(`Inserting ${item.link}`)
      return db.feedEntry.create({
        data: {
          title: item.title ?? "",
          guid: item.guid,
          link: item.link ?? "",
          author: item.creator,
          content: item.content,
          contentSnippet: item.contentSnippet,
          ingested: new Date().toISOString(),
          published: item.isoDate ? item.isoDate : item.pubDate ? new Date(item.pubDate) : null,
          categories: item.categories
            ?.map((c: string) => c.replaceAll("\n", "").trim())
            .filter((c: string) => !c.includes("|"))
            .filter(Boolean),
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
            create: item.media?.map((media: Record<string, Record<string, unknown>>) => ({
              href: media["$"]?.url,
              title: media["media:tite"]?.[0],
              description: media["media:description"]?.[0],
              credit: media["media:credit"]?.[0],
              medium: media["$"]?.medium,
              height: Number(media["$"]?.height),
              width: Number(media["$"]?.width),
              user: {
                connect: {
                  id: feed.userId,
                },
              },
            })),
          },
        },
      })
    }),
  )
}

export { updateFeed }
