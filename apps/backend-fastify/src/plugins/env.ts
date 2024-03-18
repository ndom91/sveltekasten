import fastifyEnv from "@fastify/env"
import type { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from "fastify"
import { dirname, join } from "path"

const _dirname = typeof __dirname === "undefined" ? dirname(fileURLToPath(import.meta.url)) : __dirname

declare module "fastify" {
  interface FastifyInstance {
    config: {
      JWT_SECRET: string
    }
  }
}

const schema = {
  type: "object",
  required: ["JWT_SECRET"],
  properties: {
    JWT_SECRET: {
      type: "string",
    },
  },
}

console.log("dir", `${__dirname}../../.env`)
export default async function(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
  next: HookHandlerDoneFunction,
) {
  const options = {
    confKey: "config",
    schema,
    dotenv: {
      // path: `${__dirname}../../.env`,
      path: join(_dirname, "..", "..", ".env"),
    },
  }
  await fastify.register(fastifyEnv, options)
  next()
}
