import process from "node:process";
import { PrismaClient } from "@prisma/client";
import { getLogger } from "./logger.js";

const logger = getLogger({ prefix: "db" });

process.on("exit", async () => {
  // Note: might not be necessary, hook might be built into Prisma now-a-days.
  // needs more research.
  logger.info("Cleaning up database connection");
  await prisma.$disconnect();
});

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export { prisma as db };

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
