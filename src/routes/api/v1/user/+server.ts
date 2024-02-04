import type { RequestHandler } from "./$types"
import { json, fail } from "@sveltejs/kit"
import prisma from "$lib/prisma"

// @ts-expect-error
export const PUT: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.auth()
    if (!session?.user?.userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const { data } = await request.json()

    const prismaResult = await prisma.user.update({
      data: {
        settings: data.settings,
      },
      where: {
        id: session.user.userId,
      },
    })

    return json({ data: prismaResult })
  } catch (error) {
    let message
    if (typeof error === "string") {
      message = error
    } else if (error instanceof Error) {
      message = error.message
    }
    return fail(401, { data: [], error: message })
  }
}
