import fastq from "fastq"
import { feedWorker, screenshotWorker } from "../jobs/queue-worker/index.js"
import debugFactory from "../lib/log.js"
import process from "node:process"
import type { actions } from "../lib/constants.js"

const debug = debugFactory("backend:queue")

export interface Task {
  data: Record<string, unknown>
  action: keyof typeof actions
}

const QUEUE_WORKERS = process.env.QUEUE_WORKERS
  ? Number.parseInt(process.env.QUEUE_WORKERS)
  : 1

export const screenshotQueue = fastq.promise(
  screenshotWorker,
  QUEUE_WORKERS,
)
export const feedQueue = fastq.promise(
  feedWorker,
  QUEUE_WORKERS,
)

// eslint-disable-next-line ts/no-misused-promises
process.on("exit", async () => {
  debug("Cleaning up queue workers")
  await feedQueue.kill()
  await screenshotQueue.kill()
})
