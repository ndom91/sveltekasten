import { isAuthenticated } from "$/lib/auth"
import { db } from "$lib/prisma"
import { json, text } from "@sveltejs/kit"
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
  let returnData
  try {
    const session = await isAuthenticated(event)

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

    // @ts-expect-error Method exists on all valid 'type's
    const [data, count] = await db[type].findManyAndCount({
      take: limit,
      skip,
      where: {
        ...where,
        userId: session?.user?.id,
      },
      include,
      orderBy,
    })

    if (type === "bookmark") {
      returnData = data.map((bookmark: LoadBookmark) => {
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
    return new Response(String(error), { status: 401 })
  }
}

export const fallback: RequestHandler = async ({ request }) => {
  return text(`Invalid method ${request.method}`)
}
