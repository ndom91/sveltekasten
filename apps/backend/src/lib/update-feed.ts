import Parser from "rss-parser"
import { db } from "../plugins/prisma.js"
import debugFactory from "./log.js"
import type { Feed } from "./types/zod/index.js"

const debug = debugFactory("backend:update-feed")

const parser = new Parser({
  defaultRSS: 2.0,
  customFields: {
    feed: ["language", "copyright"],
    item: [["media:content", "media", { keepArray: true }]],
  },
})

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
  const { items } = await parser.parseString(xml)

  // Get GUIDs of all items parsed from feed
  const itemGuids = items.map(item => item.guid ?? "").filter(Boolean)

  // If no items in parsed feed, return
  if (!itemGuids.length) {
    debug(`No items in parsed feed: ${feed.url}`)
    return
  }

  // Find pre-existing feed entries
  const matchedFeedEntries = await db.feedEntry.findMany({
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
  const newItems = items.filter(
    item => !matchedFeedEntries.some(entry => entry.guid === item.guid),
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
      debug.info(`Inserting ${item.link}`)
      return db.feedEntry.create({
        data: {
          title: item.title ?? "",
          guid: item.guid,
          link: item.link ?? "",
          author: item.creator,
          content: item.content,
          contentSnippet: item.contentSnippet,
          ingested: new Date().toISOString(),
          published: item.isoDate
            ? item.isoDate
            : item.pubDate
              ? new Date(item.pubDate)
              : null,
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
            create: item.media?.map(
              (media: Record<string, Record<string, unknown>>) => ({
                href: media.$?.url,
                title: media["media:tite"]?.[0],
                description: media["media:description"]?.[0],
                credit: media["media:credit"]?.[0],
                medium: media.$?.medium,
                height: Number(media.$?.height),
                width: Number(media.$?.width),
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
