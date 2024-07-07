import { fetchFeed } from "../../lib/feed.js"
import debugFactory from "../../lib/log.js"
import { db } from "../../plugins/prisma.js"

const debug = debugFactory("backend:create-feed")

export interface CreateFeedData {
  userId: string
  feedUrl: string
}

const INITIAL_ITEMS_TO_FETCH = 20

export const createFeed = async (data: CreateFeedData) => {
  const feed = await fetchFeed({ url: data.feedUrl })
  if (!feed) {
    debug(`No feed data: ${data.feedUrl}`)
    return
  }

  debug(`Inserting feed: ${feed.self}`)

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
          .slice(0, INITIAL_ITEMS_TO_FETCH)
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
  debug(`Feed Create Success ${feed.url}`)
}
