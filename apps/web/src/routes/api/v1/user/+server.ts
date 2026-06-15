import { json, text } from "@sveltejs/kit"
import { requireUser } from "$/lib/auth"
import { db } from "$lib/prisma"
import type { RequestHandler } from "./$types"

export const PUT: RequestHandler = async (event) => {
  try {
    const { userId } = requireUser(event)
    const { data } = await event.request.json()

    const prismaResult = await db.user.update({
      data: {
        settings: data.settings,
      },
      where: {
        id: userId,
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

export const fallback: RequestHandler = ({ request }) => {
  return text(`Invalid method ${request.method}`, { status: 405 })
}
