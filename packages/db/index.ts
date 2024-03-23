import { PrismaClient, Prisma } from "@prisma/client";

export * from "@prisma/client"
export * as prismaZod from "./zod-prisma/index.js"

const globalForPrisma = globalThis as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient().$extends({
  name: "findManyAndCount",
  model: {
    $allModels: {
      findManyAndCount<Model, Args>(
        this: Model,
        args: Prisma.Exact<Args, Prisma.Args<Model, "findMany">>,
      ): Promise<[Prisma.Result<Model, Args, "findMany">, number]> {
        return prisma.$transaction([
          (this as any).findMany(args),
          (this as any).count({ where: (args as any).where }),
        ]) as any
      },
    },
  },
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
