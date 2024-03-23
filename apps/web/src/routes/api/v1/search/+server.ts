// import prisma from "$lib/prisma"
import { db as prisma } from "@briefkasten/db"
import { text, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

type RequestBody = {
  where: Record<string, unknown>
  include: Record<string, unknown>
  orderBy: Record<string, Record<string, string>>
  type: "feedEntry" | "bookmark"
  limit: number
  skip: number
}

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.auth()
    if (!session?.user?.id) {
      return new Response(null, { status: 401, statusText: "Unauthorized" })
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
      return new Response(null, { status: 401, statusText: "Missing 'type' parameter" })
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
    return new Response(String(error), { status: 401 })
  }
}

export const fallback: RequestHandler = async ({ request }) => {
  return text(`Invalid method ${request.method}`)
}
