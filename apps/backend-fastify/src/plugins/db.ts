import { PrismaClient } from "@briefkasten/db"
// import fp from "fastify-plugin"
import type { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from "fastify"

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

const prisma = new PrismaClient()
function prismaPlugin(fastify: FastifyInstance, _options: FastifyPluginOptions, next: HookHandlerDoneFunction) {
  if (!fastify.prisma) {
    fastify.decorate("prisma", prisma)

    fastify.addHook("onClose", async () => {
      if (fastify.prisma === prisma) {
        await prisma.$disconnect()
      }
    })
  }

  next()
}

// export const fastifyPrisma: FastifyPluginCallback = fp(prismaPlugin, { name: "fastify-prisma" })

export { prismaPlugin as default, prisma }
