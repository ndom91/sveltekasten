import { Cron } from "croner"
// import { prisma } from "../plugins/db.js"
import { db } from "@briefkasten/db"
import { format } from "@formkit/tempo"
import { updateFeed } from "../lib/update-feed.js"
import { getLogger } from "../plugins/logger.js"

const logger = getLogger({ prefix: "cron" })

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
    logger.info("Refreshing feeds")
    try {
      const oneHourAgo = new Date()
      oneHourAgo.setHours(oneHourAgo.getHours() - 1)
      const feeds = await db.feed.findMany({
        where: {
          lastFetched: {
            lte: oneHourAgo,
          },
        },
      })
      if (!feeds.length) {
        logger.info("No feeds to refresh")
        logger.info(`Next run: ${format(cron.nextRun() ?? "", { date: "medium", time: "long" })}`)
        return
      }
      logger.info(`Found ${feeds.length} feeds to refresh ${feeds.map((f) => f.url)}`)

      await Promise.all(
        feeds.map(async (feed) => {
          logger.info(`Updating feed - ${feed.url}`)
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
          logger.info(`Feed updated`)
          logger.info(`Next run: ${format(cron.nextRun() ?? "", { date: "medium", time: "long" })}`)
        }),
      )
    } catch (error) {
      logger.error(error)
    }
  },
)
