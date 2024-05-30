import parser from "@rowanmanning/feed-parser"
import debugFactory from "../../lib/log.js"
import { db } from "../../plugins/prisma.js"

const debug = debugFactory("backend:create-feed")

export interface CreateFeedData {
  userId: string
  feedUrl: string
}

export const createFeed = async (data: CreateFeedData) => {
  const response = await fetch(data.feedUrl)
  const xml = await response.text()
  const feed = parser(xml)
  debug.info(`Inserting feed: ${feed.self}`)

  await db.feed.create({
    data: {
      name: feed.title ?? feed.url ?? "",
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
            if (!a.published || !b.published) {
              return -1
            }
            if (a.published > b.published) {
              return -1
            }
            return 1
          })
          // Only add the latest 10 entries to database
          .slice(0, 10)
          .map(item => ({
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
                id: data.userId,
              },
            },
            feedMedia: {
              create: item.media?.filter(media => media.type === "image" && !!media.title && !!media.url).map(media => ({
                href: media.url,
                title: media.title,
                user: {
                  connect: {
                    id: data.userId,
                  },
                },
              }),
              ),
            },
          })),
      },
    },
  })
  debug.info(`Feed Create Success ${feed.link}`)
}
