import type { FastifyPluginAsync, FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify"

const root: FastifyPluginAsync = async (fastify: FastifyInstance, _options: FastifyPluginOptions): Promise<void> => {
  fastify.get("/", async function (_request: FastifyRequest, _reply: FastifyReply) {
    return { root: true }
  })
}

export default root
