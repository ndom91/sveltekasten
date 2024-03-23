import { PrismaClient } from "@briefkasten/db"

// const { PrismaClient } = database

const prisma = new PrismaClient()

// TODO: onkill
// await prisma.$disconnect()

export { prisma as db }
