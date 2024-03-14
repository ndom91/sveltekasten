import type { FastifyInstance } from "fastify"
import { postFeedSchema } from "./schema"
import { getQueueHandler, postFeedToQueuehandler } from "./handler"

export default async (fastify: FastifyInstance) => {
  fastify.get("/", getQueueHandler)
  fastify.post("/", { schema: postFeedSchema }, postFeedToQueuehandler)
}
