import type { RequestHandler } from "./$types"
import { json, fail } from "@sveltejs/kit"
import prisma from "$lib/prisma"

// Mark all FeedEntries as read
// @ts-expect-error
export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.auth()
    if (!session?.user?.userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const { feedId } = await request.json()

    const data = await prisma.feedEntry.updateMany({
      data: {
        unread: false,
      },
      where: {
        feedId,
        userId: session?.user?.userId,
      },
    })

    return json({ data })
  } catch (error: any) {
    return fail(401, { data: [], error: error.message ?? error })
  }
}
