import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma-backend/client";
import debugFactory from "../lib/log.js";
import process from "node:process";

const debug = debugFactory("backend:db");

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export { prisma as db };

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on("exit", async () => {
  // Note: might not be necessary, hook might be built into Prisma now-a-days.
  // needs more research.
  debug("Cleaning up database connection");
  await prisma.$disconnect();
});
