import { db } from "$lib/prisma"
import { text, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const PUT: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.auth()
    if (!session?.user?.id) {
      return new Response(null, { status: 401, statusText: "Unauthorized" })
    }
    const { data } = await request.json()

    const prismaResult = await db.tag.update({
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

    const prismaResult = await prisma.db.tag.delete({
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

export const fallback: RequestHandler = async ({ request }) => {
  return text(`Invalid method ${request.method}`)
}
