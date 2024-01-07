import prisma from '$lib/prisma';
import { fail } from "@sveltejs/kit";
import { Prisma } from "@prisma/client"
import { CategoryCreateInputSchema } from '$zod'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, parent }) => {
  await parent()
  const session = await locals.getSession()

  const response = await prisma.category.findMany({
    where: { userId: session?.user?.userId }
  })

  return { categories: response };
};

export const actions: Actions = {
  createCategory: async ({ request, locals }) => {
    const session = await locals.getSession()
    if (!session?.user?.userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
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
    } catch (error) {
      let message
      if (typeof error === "string") {
        message = error.toUpperCase() // works, `e` narrowed to string
      } else if (error instanceof Error) {
        message = error.message // works, `e` narrowed to Error
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.log(
            'There is a unique constraint violation, category could not be created'
          )
        }
      }
      // const { fieldErrors: errors } = error.flatten();

      return fail(500, { message: "Error", type: "error", error: message, data: { name, description } })
    }
  },
}
