import { Prisma, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
  .$extends({
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
  .$extends({
    result: {
      bookmark: {
        save: {
          needs: { id: true },
          compute(bookmark) {
            return () => prisma.bookmark.update({ where: { id: bookmark.id }, data: bookmark })
          },
        },
      },
      user: {
        save: {
          needs: { id: true },
          compute(user) {
            return () => prisma.user.update({ where: { id: user.id }, data: user })
          },
        },
      },
    },
  })

export default prisma
