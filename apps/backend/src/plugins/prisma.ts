import process from "node:process"
import { PrismaClient } from "@prisma/client"
import debugFactory from "../lib/log.js"

const debug = debugFactory("backend:db")

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
  // eslint-disable-next-line no-restricted-globals
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export { prisma as db }

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma
}

// eslint-disable-next-line ts/no-misused-promises
process.on("exit", async () => {
  // Note: might not be necessary, hook might be built into Prisma now-a-days.
  // needs more research.
  debug("Cleaning up database connection")
  await prisma.$disconnect()
})
