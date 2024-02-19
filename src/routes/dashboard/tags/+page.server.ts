import prisma from "$lib/prisma"
import { fail, redirect } from "@sveltejs/kit"
import { Prisma } from "@prisma/client"
import { TagCreateInputSchema, Tag } from "$zod"
import type { Actions, PageServerLoad } from "./$types"
import type { ZodError } from "zod"

export const load: PageServerLoad = async ({ url, locals }) => {
  const session = await locals.auth()
  if (!session && url.pathname !== "/login") {
    const fromUrl = url.pathname + url.search
    redirect(303, `/login?redirectTo=${encodeURIComponent(fromUrl)}`)
  }
  if (!session?.user?.userId) {
    return fail(401, { type: "error", error: "Unauthenticated" })
  }

  const response = await prisma.tag.findMany({
    where: { userId: session.user.userId },
  })

  return {
    session,
    tags: response,
  }
}

export const actions: Actions = {
  createTag: async ({ request, locals }) => {
    const session = await locals.auth()
    if (!session?.user?.userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const formData = await request.formData()
    const dataEntries = Object.fromEntries(formData.entries())

    try {
      const parsedData = TagCreateInputSchema.parse(dataEntries)

      await prisma.tag.create({
        data: {
          name: parsedData.name,
          userId: session.user.userId,
        },
      })

      return { message: "Tag Created", type: "success", form: dataEntries }
    } catch (err: ZodError | any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          console.log("There is a unique constraint violation, tag could not be created")
        }
      }
      const { fieldErrors: errors } = err.flatten()

      return fail(500, {
        message: "Error",
        type: "error",
        errors,
        data: dataEntries,
      })
    }
  },
}
