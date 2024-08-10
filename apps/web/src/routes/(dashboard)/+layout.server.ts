import { fail } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"
import { db } from "$lib/prisma"
import { formSchema } from "$schemas/quick-add"
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
    const [categories, tags] = await db.$transaction([
      db.category.findMany({
        where: { userId: session?.user?.id },
      }),
      db.tag.findMany({
        where: { userId: session?.user?.id },
      }),
    ])
    return {
      quickAddForm,
      tags,
      categories: categories.map((category) => ({ ...category, visible: true })),
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
