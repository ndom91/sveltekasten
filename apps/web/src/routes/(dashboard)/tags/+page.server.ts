// import { db } from "@briefkasten/db"
import { db } from "$lib/prisma"
import { fail, redirect } from "@sveltejs/kit"
import * as Prisma from "@briefkasten/db"
import { TagCreateInputSchema } from "@briefkasten/db/types"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ url, locals }) => {
  const session = await locals.auth()
  if (!session && url.pathname !== "/login") {
    const fromUrl = url.pathname + url.search
    redirect(303, `/login?redirectTo=${encodeURIComponent(fromUrl)}`)
  }
  if (!session?.user?.id) {
    return fail(401, { type: "error", error: "Unauthenticated" })
  }

  const response = await db.tag.findMany({
    where: { userId: session.user.id },
  })

  return {
    session,
    tags: response,
  }
}

export const actions: Actions = {
  createTag: async ({ request, locals }) => {
    const session = await locals.auth()
    if (!session?.user?.id) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const formData = await request.formData()
    const dataEntries = Object.fromEntries(formData.entries())

    try {
      const parsedData = TagCreateInputSchema.parse(dataEntries)

      await db.tag.create({
        data: {
          name: parsedData.name,
          userId: session.user.id,
        },
      })

      return { message: "Tag Created", type: "success", form: dataEntries }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      } else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        console.error("There is a unique constraint violation, tag could not be created")
      } else {
        console.error(error)
      }

      return fail(500, {
        message: "Error",
        type: "error",
        error,
        data: dataEntries,
      })
    }
  },
  deleteTag: async ({ request, locals }) => {
    try {
      const session = await locals.auth()
      if (!session?.user?.id) {
        return fail(401, { type: "error", error: "Unauthenticated" })
      }
      const formData = await request.formData()

      const tagId = formData.get("id")
      if (!tagId) {
        return fail(401, { type: "error", error: "Requires tag ID" })
      }

      await db.tag.delete({
        where: {
          id: String(tagId),
          userId: session.user.id,
        },
      })

      return { message: "Tag Deleted", type: "success" }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error(error)
      }

      return fail(500, {
        message: "Error",
        type: "error",
        error,
      })
    }
  },
}
