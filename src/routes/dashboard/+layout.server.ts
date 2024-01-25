import prisma from "$lib/prisma"
import { fail } from "@sveltejs/kit"
import { formSchema } from "../schema"
import { superValidate } from "sveltekit-superforms/server"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ locals }) => {
  try {
    const session = await locals.auth()
    if (!session?.user?.userId) {
      fail(401, { type: "error", error: "Unauthenticated" })
    }
    const [categories, tags] = await prisma.$transaction([
      prisma.category.findMany({
        where: { userId: session?.user?.userId },
      }),
      prisma.tag.findMany({
        where: { userId: session?.user?.userId },
      }),
    ])
    return {
      form: await superValidate(formSchema),
      tags,
      categories,
    }
  } catch (error) {
    let message
    if (typeof error === "string") {
      message = error
    } else if (error instanceof Error) {
      message = error.message
    }
    return { categories: [], tags: [], error: message }
  }
}
