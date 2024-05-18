import { Cron } from "croner"
import { format } from "@formkit/tempo"
import debugFactory from "../lib/log.js"
import { db } from "../plugins/prisma.js"
import { updateFeed } from "../lib/update-feed.js"
import type { Feed } from "../lib/types/zod/index.js"

const debug = debugFactory("backend:cron")

// Run every 10 min
export const updateJob = Cron(
  "* */10 * * * *",
  {
    timezone: "Europe/London",
    name: "refreshFeeds",
    protect: true,
    interval: 60,
  },
  async (cron: Cron) => {
    // TODO: Think of some way to dedupe feed updates across multiple
    //       users effectively.
    debug.info("Refreshing feeds")
    try {
      const oneHourAgo = new Date()
      oneHourAgo.setHours(oneHourAgo.getHours() - 1)
      const feeds: Feed[] = await db.feed.findMany({
        where: {
          lastFetched: {
            lte: oneHourAgo,
          },
        },
      })
      if (!feeds.length) {
        debug.info("No feeds to refresh")
        debug.info(
          `Next run: ${format(cron.nextRun() ?? "", { date: "medium", time: "long" })}`,
        )
        return
      }
      debug.info(
        `Found ${feeds.length} feeds to refresh ${feeds.map(f => f.url).join(",")}`,
      )

      await Promise.all(
        feeds.map(async (feed) => {
          debug.info(`Updating feed - ${feed.url}`)
          await updateFeed(feed)

          // After successfully updating all new FeedEntry items, bump feed.lastFetched
          await db.feed.update({
            where: {
              id: feed.id,
            },
            data: {
              lastFetched: new Date().toISOString(),
            },
          })
          debug.info(`Feed updated`)
          debug.info(
            `Next run: ${format(cron.nextRun() ?? "", { date: "medium", time: "long" })}`,
          )
        }),
      )
    } catch (error) {
      console.error(error)
    }
  },
)
