import fastq from "fastq"
import { actions } from "../lib/constants.js"
import { feedWorker, screenshotWorker } from "../jobs/queue-worker/index.js"
import type { queueAsPromised } from "fastq"

export type Task = {
  action: keyof typeof actions
  data: Record<string, unknown>
}

const QUEUE_WORKERS = process.env.QUEUE_WORKERS ? parseInt(process.env.QUEUE_WORKERS) : 1

export const screenshotQueue: queueAsPromised<Task> = fastq.promise(screenshotWorker, QUEUE_WORKERS)
export const feedQueue: queueAsPromised<Task> = fastq.promise(feedWorker, QUEUE_WORKERS)

// TODO: onkill, end queue to avoid memory leaks
// await feedQueue.kill()
// await screenshotQueue.kill()
