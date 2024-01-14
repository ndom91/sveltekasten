import { Prisma, PrismaClient } from "@prisma/client"

// https://github.com/prisma/prisma/discussions/3087#discussioncomment-8112411
const findManyAndCount = {
  name: "findManyAndCount",
  model: {
    $allModels: {
      findManyAndCount<Model, Args>(
        this: Model,
        args: Prisma.Exact<Args, Prisma.Args<Model, "findMany">>,
      ): Promise<
        [
          Prisma.Result<Model, Args, "findMany">,
          number,
          Args extends { take: number } ? number : undefined,
        ]
      > {
        return prisma.$transaction([
          (this as any).findMany(args),
          (this as any).count({ where: (args as any).where }),
        ]) as any
      },
    },
  },
}

type FindManyAndCountType = typeof findManyAndCount.model.$allModels.findManyAndCount

// Apply the inferred types to the extended models
type ModelsWithCustomMethods = {
  [Model in keyof PrismaClient]: PrismaClient[Model] extends {
    findMany: (...args: any[]) => Promise<any>
  }
    ? {
        findManyAndCount: FindManyAndCountType
      } & PrismaClient[Model]
    : PrismaClient[Model]
}

type ExtendedPrismaClient = PrismaClient & ModelsWithCustomMethods

function createExtendedClient(): ExtendedPrismaClient {
  const prisma = new PrismaClient() as unknown as ExtendedPrismaClient
  prisma.$extends(findManyAndCount)
  return prisma
}

const prisma: ExtendedPrismaClient = createExtendedClient()

export default prisma
