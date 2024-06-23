import { json, text } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { db } from "$lib/prisma"
import { isAuthenticated } from "$lib/auth"

// Mark all FeedEntries as read
export const POST: RequestHandler = async (event) => {
  try {
    const session = await isAuthenticated(event)
    const { feedId } = await event.request.json()

    const data = await db.feedEntry.updateMany({
      data: {
        unread: false,
      },
      where: {
        feedId,
        userId: session?.user?.id,
      },
    })

    return json({ data })
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
