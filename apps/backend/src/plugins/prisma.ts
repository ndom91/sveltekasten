import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// TODO: onkill
// await prisma.$disconnect()

export { prisma as db }
