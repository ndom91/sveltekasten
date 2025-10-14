import { PrismaNeon } from "@prisma/adapter-neon";
import debugFactory from "../lib/log.js";
import { PrismaClient } from "../prisma-client/client.js";
import process from "node:process";

const debug = debugFactory("backend:db");

const prismaClientSingleton = () => {
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  });

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
