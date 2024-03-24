import { db } from "$lib/prisma"
import { fail, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const actions: Actions = {
  deleteBookmark: async ({ request, locals }) => {
    const session = await locals.auth()
    if (!session?.user?.id) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const data = await request.formData()
    const bookmarkId = data.get("bookmarkId")?.toString() || ""

    if (!bookmarkId) {
      return fail(400)
    }

    await db.bookmark.delete({
      where: {
        id: bookmarkId,
        userId: session.user.id,
      },
    })
    return { type: "success", message: "Deleted Bookmark" }
  },
}

export const load: PageServerLoad = async (event) => {
  const session = await event.locals?.auth()

  if (!session && event.url.pathname !== "/login") {
    const fromUrl = event.url.pathname + event.url.search
    redirect(303, `/login?redirectTo=${encodeURIComponent(fromUrl)}`)
  }
  try {
    const skip = Number(event.url.searchParams.get("skip") ?? "0")
    const limit = Number(event.url.searchParams.get("limit") ?? "20")

    const session = await event.locals.auth()
    if (!session?.user?.id) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }

    const [data, count] = await db.bookmark.findManyAndCount({
      take: limit + skip,
      skip: skip,
      where: {
        userId: session?.user?.id,
        archived: true,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const bookmarks = data.map((bookmark) => {
      return { ...bookmark, tags: bookmark.tags.map((tag) => tag.tag) }
    }) as LoadBookmarkFlatTags[]

    return {
      session,
      bookmarks,
      count,
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    return { feedEntries: [], count: 0, error }
  }
}
