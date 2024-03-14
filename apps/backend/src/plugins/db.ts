import { PrismaClient } from "@briefkasten/db"
import fp from "fastify-plugin"
import type { FastifyPluginCallback, FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from "fastify"

const prisma = new PrismaClient()

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

function prismaPlugin(fastify: FastifyInstance, _options: FastifyPluginOptions, done: HookHandlerDoneFunction) {
  if (!fastify.prisma) {
    fastify.decorate("prisma", prisma)

    fastify.addHook("onClose", async () => {
      if (fastify.prisma === prisma) {
        await prisma.$disconnect()
      }
    })
  }

  done()
}

export const fastifyPrisma: FastifyPluginCallback = fp(prismaPlugin, { name: "fastify-prisma" })

export { fastifyPrisma as default, prisma }
