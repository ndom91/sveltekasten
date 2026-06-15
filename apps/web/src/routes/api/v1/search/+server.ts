import { json, text } from "@sveltejs/kit"
import { isAuthenticated } from "$/lib/auth"
import { db } from "$lib/prisma"
import type { RequestHandler } from "./$types"

interface RequestBody {
  where: Record<string, unknown>
  include: Record<string, unknown>
  orderBy: Record<string, Record<string, string>>
  type: "feedEntry" | "bookmark"
  limit: number
  skip: number
}

export const POST: RequestHandler = async (event) => {
  try {
    const { userId } = isAuthenticated(event)

    const {
      include,
      orderBy,
      type,
      where = {},
      limit = 20,
      skip = 0,
    } = (await event.request.json()) as RequestBody

    if (!type) {
      return new Response(null, { status: 401, statusText: "Missing 'type' parameter" })
    }

    const [data, count] = await db[type].findManyAndCount({
      take: limit,
      skip,
      where: {
        ...where,
        userId,
      },
      include,
      orderBy,
    })

    const returnData = type === "bookmark"
      ? data.map((bookmark: LoadBookmark) => {
        return { ...bookmark, tags: bookmark.tags?.map((tag: LoadBookmark["tags"][number]) => tag.tag) }
      }) as LoadBookmarkFlatTags[]
      : data

    return json({ data: returnData, count })
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
