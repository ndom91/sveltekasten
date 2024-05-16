import fastq from "fastq";
import process from "node:process";
import { actions } from "../lib/constants.js";
import { getLogger } from "./logger.js";
import { feedWorker, screenshotWorker } from "../jobs/queue-worker/index.js";
import type { queueAsPromised } from "fastq";

const logger = getLogger({ prefix: "queue" });

export type Task = {
  action: keyof typeof actions;
  data: Record<string, unknown>;
};

const QUEUE_WORKERS = process.env.QUEUE_WORKERS
  ? parseInt(process.env.QUEUE_WORKERS)
  : 1;

export const screenshotQueue: queueAsPromised<Task> = fastq.promise(
  screenshotWorker,
  QUEUE_WORKERS,
);
export const feedQueue: queueAsPromised<Task> = fastq.promise(
  feedWorker,
  QUEUE_WORKERS,
);

process.on("exit", async () => {
  logger.debug("Cleaning up queue workers");
  await feedQueue.kill();
  await screenshotQueue.kill();
});
