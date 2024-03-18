import { Cron } from "croner"
import { prisma } from "@plugin/db"
import { updateFeed } from "@lib/update-feed"

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
    console.log("[CRON]", "Refreshing feeds")
    try {
      const oneHourAgo = new Date()
      oneHourAgo.setHours(oneHourAgo.getHours() - 1)
      const feeds = await prisma.feed.findMany({
        where: {
          lastFetched: {
            lte: oneHourAgo,
          },
        },
      })
      if (!feeds.length) {
        console.log("[CRON]", "No feeds to refresh")
        console.log("[CRON]", `Next run: ${cron.nextRun()}`)
        return
      }
      console.log(
        "[CRON]",
        `Found ${feeds.length} feeds to refresh`,
        feeds.map((f) => f.url),
      )

      await Promise.all(
        feeds.map(async (feed) => {
          console.log("[CRON]", "Updating feed", feed.url)
          await updateFeed(feed)

          // After successfully updating all new FeedEntry items, bump feed.lastFetched
          await prisma.feed.update({
            where: {
              id: feed.id,
            },
            data: {
              lastFetched: new Date().toISOString(),
            },
          })
          console.log("[CRON]", "Feed updated")
          console.log("[CRON]", `Next run: ${cron.nextRun()}`)
        }),
      )
    } catch (error) {
      console.error("[CRON]", error)
    }
  },
)
