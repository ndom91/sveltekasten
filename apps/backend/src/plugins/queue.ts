// import fastq from "fastq"
// import { actions } from "@lib/constants"
// import { queueWorker } from "@jobs/queue-worker"
// import type { queueAsPromised } from "fastq"
// import type { FastifyPluginCallback, FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from "fastify"
//
// declare module "fastify" {
//   interface FastifyInstance {
//     queue: queueAsPromised<Task>
//   }
// }
//
// export type Task = {
//   action: keyof typeof actions
//   data: Record<string, unknown>
// }
//
// const queue: queueAsPromised<Task> = fastq.promise(queueWorker, 1)
//
// function queuePlugin(fastify: FastifyInstance, _options: FastifyPluginOptions, done: HookHandlerDoneFunction) {
//   if (!fastify.queue) {
//     fastify.decorate("queue", queue)
//
//     fastify.addHook("onClose", async () => {
//       if (fastify.queue === queue) {
//         await queue.kill()
//       }
//     })
//   }
//
//   done()
// }
//
// // const fastifyQueue: FastifyPluginCallback = fp(queuePlugin, { name: "fastify-queue" })
//
// export { queuePlugin as default, queue }

import fastq from "fastq"
import { actions } from "../lib/constants.js"
import { queueWorker } from "../jobs/queue-worker/index.js"
import type { queueAsPromised } from "fastq"

export type Task = {
  action: keyof typeof actions
  data: Record<string, unknown>
}

const queue: queueAsPromised<Task> = fastq.promise(queueWorker, 1)

// TODO: onkill
// if (fastify.queue === queue) {
//   await queue.kill()
// }

export { queue }
