import { createFeed } from "./create-feed.js"
import {
  type CreateScreenshot,
  createScreenshot,
} from "./create-screenshot.js"
import debugFactory from "../../lib/log.js"
import type { CreateFeedData } from "./create-feed.js"
import type { Task } from "../../plugins/queue.js"

const debugFeed = debugFactory("backend:worker:feed")
const debugScreenshot = debugFactory("backend:worker:screenshot")

export async function feedWorker(arg: Task): Promise<void> {
  createFeed(arg.data as unknown as CreateFeedData).catch((error) => {
    debugFeed("Error creating Feed", error)
  })
}

export async function screenshotWorker(arg: Task): Promise<void> {
  createScreenshot(arg.data as unknown as CreateScreenshot).catch((error) => {
    debugScreenshot("Error creating Screenshot", error)
  })
}
