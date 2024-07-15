import { Prisma } from "@prisma/client"
import { PrismaClient } from "@prisma/client"

const db = new PrismaClient().$extends({
  name: "findManyAndCount",
  model: {
    $allModels: {
      /**
       * Find and return items and total available count
       */
      async findManyAndCount<Model, Args>(
        this: Model,
        args: Prisma.Args<Model, "findMany">,
      ): Promise<[Prisma.Result<Model, Args, "findMany">, number]> {
        const context = Prisma.getExtensionContext(this)

        return db.$transaction([
          (context as any).findMany(args),
          (context as any).count({ where: args.where }),
        ]) as Promise<[Prisma.Result<Model, Args, "findMany">, number]>
      },
    },
  },
})

export { db }
