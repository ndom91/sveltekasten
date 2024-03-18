import type { Task } from "@plugin/queue"
import { actions } from "@lib/constants"
import { createFeed } from "./create-feed"
import { createScreenshot } from "./create-screenshot"

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
