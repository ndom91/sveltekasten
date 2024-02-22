import type { RequestHandler } from "./$types"
import { json, fail } from "@sveltejs/kit"
import prisma from "$lib/prisma"

type RequestBody = {
  where: Record<string, unknown>
  include: Record<string, unknown>
  orderBy: Record<string, Record<string, string>>
  type: "feedEntry" | "bookmark"
}

export const POST: RequestHandler = async ({ request, locals, url }) => {
  try {
    const session = await locals.auth()
    if (!session?.user?.userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }

    let returnData
    const skip = Number(url.searchParams.get("skip") ?? "0")
    const limit = Number(url.searchParams.get("limit") ?? "10")
    const { where, include, orderBy, type } = (await request.json()) as RequestBody
    if (!type) {
      return fail(401, { type: "error", error: "Missing 'type' parameter" })
    }

    const [data, count] = await prisma[type].findManyAndCount({
      take: limit + skip,
      skip: skip,
      where: {
        userId: session?.user?.userId,
        ...where,
      },
      include,
      orderBy,
    })

    if (type === "bookmark") {
      returnData = data.map((bookmark) => {
        return { ...bookmark, tags: bookmark.tags?.map((tag) => tag.tag) }
      }) // satisfies LoadBookmark[]
    } else {
      returnData = data
    }

    return json({ data: returnData, count })
  } catch (error: any) {
    console.error("Search Error", error)
    return fail(401, { data: [], error: error.message ?? error })
  }
}
