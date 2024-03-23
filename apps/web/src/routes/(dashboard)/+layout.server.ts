// import prisma from "$lib/prisma"
import { db as prisma } from "@briefkasten/db"
import { fail } from "@sveltejs/kit"
import { formSchema } from "$schemas/quick-add"
import { zod } from "sveltekit-superforms/adapters"
import { superValidate } from "sveltekit-superforms"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ locals }) => {
  let quickAddForm
  try {
    quickAddForm = await superValidate(zod(formSchema), {
      id: "quickAddForm",
    })
    const session = await locals.auth()
    if (!session?.user?.id) {
      fail(401, { type: "error", error: "Unauthenticated" })
    }
    const [categories, tags] = await prisma.$transaction([
      prisma.category.findMany({
        where: { userId: session?.user?.id },
      }),
      prisma.tag.findMany({
        where: { userId: session?.user?.id },
      }),
    ])
    return {
      quickAddForm,
      tags,
      categories,
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    return {
      categories: [],
      tags: [],
      error,
      quickAddForm,
    }
  }
}
