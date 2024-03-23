// import { Prisma, PrismaClient } from "@briefkasten/db"
import * as database from "@briefkasten/db"

const { PrismaClient, Prisma } = database

const prisma = new PrismaClient().$extends({
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

export default prisma
export { prisma as db }

// import { dev } from "$app/environment"
// import * as database from "@briefkasten/db"
// console.log("database", database)
// // export { db }
// import { default as ProdPrisma } from "@briefkasten/db"
//
// let db
//
// if (!dev) {
//   db = database.db
// } else {
//   db = ProdPrisma.db
// }
// //
// export { db }
