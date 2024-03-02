import type { RequestHandler } from "./$types"
import { json, fail } from "@sveltejs/kit"
import { BookmarkUncheckedCreateInputSchema } from "$zod"
import z from "zod"
import prisma from "$lib/prisma"

// Get more Bookmarks
// @ts-expect-error
export const GET: RequestHandler = async ({ url, locals }) => {
  try {
    const session = await locals.auth()
    if (!session?.user?.id) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const skip = Number(url.searchParams.get("skip") ?? "0")
    const limit = Number(url.searchParams.get("limit") ?? "10")

    if (limit > 100) {
      return fail(401, { type: "error", error: "Attempted to load too many items" })
    }

    const data = await prisma.bookmark.findMany({
      take: limit,
      skip: skip,
      where: { userId: session?.user?.id },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return json({
      data,
    })
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    return fail(401, { data: [], error })
  }
}

// Update Bookmark
// @ts-expect-error
export const PUT: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.auth()
    if (!session?.user?.id) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const { id, update } = await request.json()

    const data = await prisma.bookmark.update({
      data: {
        ...update,
      },
      where: {
        id,
        userId: session?.user?.id,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    })

    return json({ data })
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    return fail(401, { data: [], error })
  }
}

// Create Bookmark(s)
// @ts-expect-error
export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.auth()
    if (!session?.user?.id) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const inputData = await request.json()
    const data = z.array(BookmarkUncheckedCreateInputSchema).parse(inputData)

    const upsertResponse = await prisma.bookmark.createMany({
      data,
      skipDuplicates: true,
    })

    return json({ data: upsertResponse })
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    return fail(401, { data: [], error })
  }
}
