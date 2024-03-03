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

    const prismaResult = await prisma.tag.update({
      data: {
        name: data.name,
      },
      where: {
        userId: session.user.id,
        id: data.id,
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

export const DELETE: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.auth()
    if (!session?.user?.id) {
      return new Response(null, { status: 401, statusText: "Unauthorized" })
    }
    const { data } = await request.json()

    const prismaResult = await prisma.tag.delete({
      where: {
        userId: session.user.id,
        id: data.id,
      },
    })

    return new Response(JSON.stringify(prismaResult))
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    return new Response(String(error), { status: 401 })
  }
}
