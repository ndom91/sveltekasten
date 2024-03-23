// import { db } from "@briefkasten/db"
import { db } from "$lib/prisma"
import { text, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

// Mark all FeedEntries as read
export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.auth()
    if (!session?.user?.id) {
      return new Response(null, { status: 401, statusText: "Unauthorized" })
    }
    const { feedId } = await request.json()

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
