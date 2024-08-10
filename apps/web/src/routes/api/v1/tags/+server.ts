import { json, text } from "@sveltejs/kit"
import { isAuthenticated } from "$/lib/auth"
import { db } from "$lib/prisma"
import type { RequestHandler } from "./$types"

export const PUT: RequestHandler = async (event) => {
  try {
    const session = await isAuthenticated(event)
    const { data } = await event.request.json()

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

export const DELETE: RequestHandler = async (event) => {
  try {
    const session = await isAuthenticated(event)
    const { data } = await event.request.json()

    const prismaResult = await db.tag.delete({
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
