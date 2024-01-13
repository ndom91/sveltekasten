import { Prisma, PrismaClient } from '@prisma/client'

// Prisma workaround: https://github.com/prisma/prisma/discussions/3087
// const findManyAndCount = {
//   name: 'findManyAndCount',
//   model: {
//     $allModels: {
//       findManyAndCount<Model, Args>(
//         this: Model,
//         args: Prisma.Exact<Args, Prisma.Args<Model, 'findMany'>>
//       ): Promise<[
//         Prisma.Result<Model, Args, 'findMany'>,
//         number,
//         Args extends { take: number } ? number : undefined
//       ]> {
//         return prisma.$transaction([
//           (this as any).findMany(args),
//           (this as any).count({ where: (args as any).where })
//         ]) as any;
//       }
//     }
//   }
// }

// function createExtendedClient() {
//   return new PrismaClient().$extends(findManyAndCount);
// }
//
// type ExtendedPrismaClient = ReturnType<typeof createExtendedClient>;
// type PC = Omit<ExtendedPrismaClient, keyof PrismaClient> & PrismaClient
//
// const prisma = createExtendedClient() as unknown as PC;
//
// export default prisma
const prisma = new PrismaClient().$extends({
  name: 'findManyAndCount',
  model: {
    $allModels: {
      findManyAndCount<Model, Args>(
        this: Model,
        args: Prisma.Exact<Args, Prisma.Args<Model, 'findMany'>>
      ): Promise<[Prisma.Result<Model, Args, 'findMany'>, number]> {
        return prisma.$transaction([
          (this as any).findMany(args),
          (this as any).count({ where: (args as any).where })
        ]) as any;
      }
    }
  }
});

export default prisma
