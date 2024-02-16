import prisma from "$lib/prisma"
import { fail, redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ locals, url }) => {
  try {
    const session = await locals.auth()
    if (!session && url.pathname !== "/login") {
      const fromUrl = url.pathname + url.search
      redirect(303, `/login?redirectTo=${encodeURIComponent(fromUrl)}`)
    }
    // if (!session?.user?.userId) {
    //   return fail(401, { type: "error", error: "Unauthenticated" })
    // }
    const skip = Number(url.searchParams.get("skip") ?? "0")
    const limit = Number(url.searchParams.get("limit") ?? "10")

    if (limit > 100) {
      return fail(401, { type: "error", error: "Attempted to load too many items" })
    }

    const [bookmarkData, bookmarkCount] = await prisma.bookmark.findManyAndCount({
      take: limit + skip,
      skip: skip,
      where: { userId: session?.user?.userId, archived: true },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return {
      session,
      bookmarks: {
        data: bookmarkData,
        count: bookmarkCount,
      },
    }
  } catch (error: any) {
    return { feedEntries: [], count: 0, error: error.message ?? error }
  }
}
