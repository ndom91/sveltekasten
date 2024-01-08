import prisma from "$lib/prisma";
import { fail } from "@sveltejs/kit";
import { Prisma } from "@prisma/client";
import { TagCreateInputSchema } from "$zod";
import type { Actions, PageServerLoad } from "./$types";
import type { ZodError } from "zod";

export const load: PageServerLoad = async ({ parent, locals }) => {
  await parent()
  const session = await locals.getSession();
  if (!session?.user?.userId) {
    return fail(401, { type: "error", error: "Unauthenticated" })
  }

  const response = await prisma.tag.findMany({
    where: { userId: session.user.userId },
  });

  return { tags: response };
};

export const actions: Actions = {
  createTag: async ({ request, locals }) => {
    const session = await locals.getSession();
    if (!session?.user?.userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const formData = Object.fromEntries(await request.formData());
    const { name, emoji } = formData as { name: string; emoji: string };

    try {
      TagCreateInputSchema.parse(formData);

      await prisma.tag.create({
        data: {
          name,
          emoji,
          userId: session.user.userId,
        },
      });

      return { message: "Tag Created", type: "success", form: formData };
    } catch (err: ZodError | any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          console.log(
            "There is a unique constraint violation, tag could not be created",
          );
        }
      }
      const { fieldErrors: errors } = err.flatten();

      return fail(500, {
        message: "Error",
        type: "error",
        errors,
        data: { name, emoji },
      });
    }
  },
};
