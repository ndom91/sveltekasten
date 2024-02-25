import type { RequestHandler } from "./$types"
import { json, fail } from "@sveltejs/kit"
import prisma from "$lib/prisma"
import type { Tag } from "$zod"

type RequestBody = {
  where: Record<string, unknown>
  include: Record<string, unknown>
  orderBy: Record<string, Record<string, string>>
  type: "feedEntry" | "bookmark"
  limit: number
  skip: number
}

// @ts-expect-error
export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.auth()
    if (!session?.user?.id) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }

    let returnData
    const {
      include,
      orderBy,
      type,
      where = {},
      limit = 20,
      skip = 0,
    } = (await request.json()) as RequestBody
    if (!type) {
      return fail(401, { type: "error", error: "Missing 'type' parameter" })
    }

    const [data, count] = await prisma[type].findManyAndCount({
      take: limit,
      skip: skip,
      where: {
        ...where,
        userId: session?.user?.id,
      },
      include,
      orderBy,
    })

    if (type === "bookmark") {
      returnData = data.map((bookmark) => {
        // @ts-expect-error dynamic model in query above breaks infered type
        return { ...bookmark, tags: bookmark.tags?.map((tag) => tag.tag) }
      }) as LoadBookmarkFlatTags[]
    } else {
      returnData = data
    }

    return json({ data: returnData, count })
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    return fail(401, { data: [], error })
  }
}
