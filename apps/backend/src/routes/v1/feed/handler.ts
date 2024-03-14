import type { RouteHandler, FastifyRequest, FastifyReply } from "fastify"
import { actions } from "@lib/constants"
import { decode } from "@lib/jwt"

export const getQueueHandler: RouteHandler = async function (request: FastifyRequest, reply: FastifyReply) {
  const queue = request.server.queue.getQueue()
  reply.preventCache()
  return reply.send({ queue })
}

export const postFeedToQueuehandler = async function (request: FastifyRequest, reply: FastifyReply) {
  let token
  if (request.headers.authorization) {
    token = request.headers.authorization.split("Bearer ")[1]
  } else if (request.cookies["authjs.session-token"]) {
    token = request.cookies["authjs.session-token"]
  }

  const payload = await decode({
    token,
    secret: process.env.JWT_SECRET!,
    salt: "authjs.session-token",
  })

  // Unable to decode JWT
  if (!payload?.sub) {
    throw request.server.httpErrors.unauthorized()
  }

  try {
    // @ts-expect-error body not typed correctly
    const { feedUrl } = request.body
    if (!feedUrl || !payload?.sub) {
      throw reply.badRequest("feedUrl and userId required")
    }
    await request.server.queue.push({
      action: actions.ADD_FEED,
      data: {
        feedUrl,
        userId: payload?.sub,
      },
    })
    return reply.send("ok")
  } catch (error) {
    console.log(error)
    // @ts-expect-error error typed unknown
    return reply.internalServerError(typeof error === "string" ? error : error.message)
  }
}
