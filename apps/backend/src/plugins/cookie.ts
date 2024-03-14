import fp from "fastify-plugin"
import cookie from "@fastify/cookie"

/**
 * This plugins adds cookie parsing and serialization
 *
 * @see https://github.com/fastify/fastify-cookie
 */
export default fp(async (fastify) => {
  fastify.register(cookie)
})
