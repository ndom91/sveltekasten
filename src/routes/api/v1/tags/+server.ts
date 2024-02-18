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

    const prismaResult = await prisma.tag.update({
      data: {
        name: data.name,
      },
      where: {
        userId: session.user.userId,
        id: data.id,
      },
    })

    return json({ data: prismaResult })
  } catch (error: any) {
    return fail(401, { data: [], error: error.message ?? error })
  }
}

// @ts-expect-error
export const DELETE: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.auth()
    if (!session?.user?.userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const { data } = await request.json()

    const prismaResult = await prisma.tag.delete({
      where: {
        userId: session.user.userId,
        id: data.id,
      },
    })

    return json({ data: prismaResult })
  } catch (error: any) {
    return fail(401, { data: [], error: error.message ?? error })
  }
}
