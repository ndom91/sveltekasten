import type { RequestHandler } from "./$types"
import { json } from "@sveltejs/kit"
import prisma from "$lib/prisma"

export const PUT: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.auth()
    if (!session?.user?.id) {
      return new Response(null, { status: 401, statusText: "Unauthorized" })
    }
    const { data } = await request.json()

    const prismaResult = await prisma.user.update({
      data: {
        settings: data.settings,
      },
      where: {
        id: session.user.id,
      },
    })

    return json({ data: prismaResult })
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    return new Response(String(error), { status: 401 })
  }
}
