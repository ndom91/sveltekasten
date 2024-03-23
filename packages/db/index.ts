import { PrismaClient, Prisma } from "@prisma/client"
// import type { Prisma } from "@prisma/client"

// export * from "@prisma/client"
export { PrismaClient, Prisma }
export * as prismaZod from "./types/index.js"

// TODO: any for now since 'PrismaClient'
// const globalForPrisma = globalThis as { prisma?: any };

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// const createPrismaClient = () => {
//   const db = new PrismaClient().$extends({
//     name: "findManyAndCount",
//     model: {
//       $allModels: {
//         findManyAndCount<Model, Args>(
//           this: Model,
//           args: Prisma.Exact<Args, Prisma.Args<Model, "findMany">>,
//         ): Promise<[Prisma.Result<Model, Args, "findMany">, number]> {
//           return db.$transaction([
//             (this as any).findMany(args),
//             (this as any).count({ where: (args as any).where }),
//           ]) as any
//         },
//       },
//     },
//   })
//   return db
// }
// export const db = globalForPrisma.prisma ?? PrismaClient
// export const db = createPrismaClient()
//
// declare global {
//   // We need `var` to declare a global variable in TypeScript
//   // eslint-disable-next-line no-var
//   var prisma: PrismaClient | undefined
// }

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
