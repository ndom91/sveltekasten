import type { Task } from "../../plugins/queue.js"
// import { actions } from "../../lib/constants.js"
import { createFeed } from "./create-feed.js"
import { createScreenshot } from "./create-screenshot.js"
import { type CreateFeedData } from "./create-feed.js"

// export async function queueWorker(arg: Task): Promise<void> {
//   switch (arg.action) {
//     case actions.ADD_FEED:
//       // @ts-expect-error
//       createFeed(arg.data)
//       break
//     case actions.ADD_SCREENSHOT:
//       console.time("2queueWorker.index.screenshot")
//       createScreenshot(arg.data)
//       console.timeEnd("2queueWorker.index.screenshot")
//       break
//   }
// }

export async function feedWorker(arg: Task): Promise<void> {
  createFeed(arg.data as CreateFeedData)
}

export async function screenshotWorker(arg: Task): Promise<void> {
  createScreenshot(arg.data)
}
