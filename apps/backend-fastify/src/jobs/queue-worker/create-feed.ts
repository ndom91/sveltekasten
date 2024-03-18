import { prisma } from "@plugin/db"
import Parser from "rss-parser"

const parser = new Parser({
  defaultRSS: 2.0,
  customFields: {
    feed: ["language", "copyright"],
    item: [["media:content", "media", { keepArray: true }]],
  },
})

type CreateFeedData = {
  userId: string
  feedUrl: string
}

export const createFeed = async (data: CreateFeedData) => {
  const response = await fetch(data.feedUrl)
  const xml = await response.text()
  const feed = await parser.parseString(xml)
  console.log("[QUEUE.WORKER]", "Inserting Feed:", feed.link)

  await prisma.feed.create({
    data: {
      name: feed.title ? feed.title : feed.link ?? "",
      url: data.feedUrl,
      description: feed.description,
      language: feed.language,
      copyright: feed.copyright,
      lastFetched: new Date().toISOString(),
      user: {
        connect: {
          id: data.userId,
        },
      },
      feedEntries: {
        create: feed.items
          .sort((a, b) => {
            if (!a.isoDate || !b.isoDate) return -1
            if (new Date(a.isoDate) > new Date(b.isoDate)) {
              return -1
            }
            return 1
          })
          // Only add the latest 10 entries to database
          .slice(0, 10)
          .map((item) => ({
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
                id: data.userId,
              },
            },
            feedMedia: {
              create: item.media?.map((media: Record<string, Record<string, unknown>>) => ({
                href: media["$"].url,
                title: media["media:tite"]?.[0],
                description: media["media:description"]?.[0],
                credit: media["media:credit"]?.[0],
                medium: media["$"].medium,
                // @ts-expect-error
                height: media["$"].height ? parseInt(media["$"].height) : null,
                // @ts-expect-error
                width: media["$"].width ? parseInt(media["$"].width) : null,
                user: {
                  connect: {
                    id: data.userId,
                  },
                },
              })),
            },
          })),
      },
    },
  })
  console.log("[QUEUE.WORKER]", "Feed Create Success", feed.link)
}
