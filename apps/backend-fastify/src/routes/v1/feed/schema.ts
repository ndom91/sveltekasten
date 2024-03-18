import type { FastifySchema } from "fastify"

const feedBodySchema = {
  type: "object",
  required: ["userId", "feedUrl"],
  properties: {
    userId: { type: "string" },
    feedUrl: { type: "string" },
  },
} as const

const postFeedSchema: FastifySchema = {
  tags: ["Feed"],
  description: "Add a new feed to the queue",
  body: feedBodySchema,
  response: {
    201: {
      type: "string",
      description: "Feed submitted",
    },
    500: {
      type: "string",
    },
  },
}

export { postFeedSchema }
