import { prisma } from "@plugin/db"
import Parser from "rss-parser"
import type { Feed } from "@types"

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
    console.log("[CRON]", "No items in parsed feed: ", feed.url)
    return
  }

  // Find pre-existing feed entries
  const matchedFeedEntries = await prisma.feedEntry.findMany({
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
  console.log(
    "[CRON]",
    "new.items",
    newItems.map((item) => item.title),
  )

  // If no new items, return
  if (!newItems.length) {
    console.log("[CRON]", "No new items to update in parsed feed:", feed.url)
    return
  }

  // If we have new items to insert, insert their FeedEntry and FeedEntryMedia
  await Promise.all(
    newItems.map((item) => {
      console.log("[CRON]", "Inserting", item.link)
      return prisma.feedEntry.create({
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
              href: media["$"].url,
              title: media["media:tite"]?.[0],
              description: media["media:description"]?.[0],
              credit: media["media:credit"]?.[0],
              medium: media["$"].medium,
              height: media["$"].height ? Number(media["$"].height) : null,
              width: media["$"].width ? Number(media["$"].width) : null,
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
