import prisma from "$lib/prisma"
import { fail } from "@sveltejs/kit"
import { formSchema } from "$schemas/quick-add"
import { zod } from "sveltekit-superforms/adapters"
import { superValidate } from "sveltekit-superforms"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ locals }) => {
  const quickAddForm = await superValidate(zod(formSchema), {
    id: "quickAddForm",
  })
  try {
    const session = await locals.auth()
    if (!session?.user?.id) {
      fail(401, { type: "error", error: "Unauthenticated" })
    }
    const [categories, tags, user] = await prisma.$transaction([
      prisma.category.findMany({
        where: { userId: session?.user?.id },
      }),
      prisma.tag.findMany({
        where: { userId: session?.user?.id },
      }),
      prisma.user.findUnique({
        select: { settings: true },
        where: { id: session?.user?.id },
      }),
    ])
    return {
      quickAddForm,
      tags,
      categories,
      user,
    }
  } catch (error: any) {
    return {
      categories: [],
      tags: [],
      error: error.message ?? error,
      quickAddForm,
    }
  }
}
