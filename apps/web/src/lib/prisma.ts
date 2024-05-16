import { PrismaClient, Prisma } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient().$extends({
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

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export { prisma as db }
