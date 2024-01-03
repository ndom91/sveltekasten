import prisma from '$lib/prisma';
import { fail } from "@sveltejs/kit";
import { Prisma } from "@prisma/client"
import { CategoryCreateInputSchema } from '$zod'
import type { Actions, PageServerLoad } from './$types'
import type { ZodError } from 'zod';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession()

  const response = await prisma.category.findMany({
    where: { userId: session.user.userId }
  })

  return { categories: response };
};

export const actions: Actions = {
  createCategory: async ({ request, locals }) => {
    const session = await locals.getSession()
    const formData = Object.fromEntries(await request.formData())
    const { name, description } = formData as { name: string, description: string }

    try {
      CategoryCreateInputSchema.parse(formData)

      await prisma.category.create({
        data: {
          name,
          description,
          userId: session.user.userId,
        }
      })

      return { message: 'Category Created', type: "success", form: formData }
    } catch (err: ZodError | any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          console.log(
            'There is a unique constraint violation, category could not be created'
          )
        }
      }
      const { fieldErrors: errors } = err.flatten();

      return fail(500, { message: 'Error', type: "error", errors, data: { name, description } })
    }
  },
}
