import { createFeed } from "./create-feed.js";
import {
  createScreenshot,
  type CreateScreenshot,
} from "./create-screenshot.js";
import { type Task } from "../../plugins/queue.js";
import { type CreateFeedData } from "./create-feed.js";

export async function feedWorker(arg: Task): Promise<void> {
  createFeed(arg.data as CreateFeedData);
}

export async function screenshotWorker(arg: Task): Promise<void> {
  createScreenshot(arg.data as CreateScreenshot);
}
