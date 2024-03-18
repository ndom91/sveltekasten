// import fp from "fastify-plugin"
import sensible from "@fastify/sensible"
import type { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from "fastify"

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default function(fastify: FastifyInstance, _options: FastifyPluginOptions, next: HookHandlerDoneFunction) {
  fastify.register(sensible)
  next()
}
