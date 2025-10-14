import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../prisma-client/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// TODO: Reimplement singleton for prod
const db = new PrismaClient({ adapter }).$extends({
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
        const context = Prisma.getExtensionContext(this);

        return db.$transaction([
          (context as any).findMany(args),
          (context as any).count({ where: args.where }),
        ]) as Promise<[Prisma.Result<Model, Args, "findMany">, number]>;
      },
    },
  },
});

export { db };
