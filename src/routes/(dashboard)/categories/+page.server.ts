import prisma from "$lib/prisma"
import { fail, redirect } from "@sveltejs/kit"
import { Prisma } from "@prisma/client"
import { CategoryCreateInputSchema } from "$zod"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ locals, url }) => {
  const session = await locals.auth()
  if (!session && url.pathname !== "/login") {
    const fromUrl = url.pathname + url.search
    redirect(303, `/login?redirectTo=${encodeURIComponent(fromUrl)}`)
  }
  // if (!session?.user?.id) {
  //   return fail(401, { type: "error", error: "Unauthenticated" })
  // }

  const response = await prisma.category.findMany({
    where: { userId: session?.user?.id },
  })

  return {
    session,
    categories: response,
  }
}

export const actions: Actions = {
  createCategory: async ({ request, locals }) => {
    const session = await locals.auth()
    if (!session?.user?.id) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const formData = Object.fromEntries(await request.formData())
    const { name, description } = formData as { name: string; description: string }

    try {
      CategoryCreateInputSchema.parse(formData)

      await prisma.category.create({
        data: {
          name,
          description,
          userId: session.user.id,
        },
      })

      return { message: "Category Created", type: "success", form: formData }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      } else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        console.error("There is a unique constraint violation, category could not be created")
      } else {
        console.error(error)
      }
      // const { fieldErrors: errors } = error.flatten();

      return fail(500, {
        message: "Error",
        type: "error",
        error,
        data: { name, description },
      })
    }
  },
}
