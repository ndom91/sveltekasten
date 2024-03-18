import type { Task } from "../../plugins/queue.js"
import { actions } from "../../lib/constants.js"
import { createFeed } from "./create-feed.js"
import { createScreenshot } from "./create-screenshot.js"

export async function queueWorker(arg: Task): Promise<void> {
  switch (arg.action) {
    case actions.ADD_FEED:
      // @ts-expect-error
      await createFeed(arg.data)
      break
    case actions.ADD_SCREENSHOT:
      await createScreenshot(arg.data)
      break
  }
}
