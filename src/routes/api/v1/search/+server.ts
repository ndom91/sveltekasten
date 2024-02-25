import type { RequestHandler } from "./$types"
import { json, fail } from "@sveltejs/kit"
import prisma from "$lib/prisma"

type RequestBody = {
  where: Record<string, unknown>
  include: Record<string, unknown>
  orderBy: Record<string, Record<string, string>>
  type: "feedEntry" | "bookmark"
  limit: number
  skip: number
}

export const POST: RequestHandler = async ({ request, locals, url }) => {
  try {
    const session = await locals.auth()
    if (!session?.user?.id) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }

    let returnData
    // const skip = Number(url.searchParams.get("skip") ?? "0")
    // const limit = Number(url.searchParams.get("limit") ?? "10")
    console.log("v1/search POST handler")
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

    console.log("loading more..", { skip, limit })
    console.log(
      "findManyAndCount.args",
      JSON.stringify(
        {
          take: limit,
          skip: skip,
          where: {
            ...where,
            userId: session?.user?.id,
          },
          include,
          orderBy,
        },
        null,
        2,
      ),
    )

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
        return { ...bookmark, tags: bookmark.tags?.map((tag) => tag.tag) }
      }) // satisfies LoadBookmark[]
    } else {
      returnData = data
    }

    console.log("findManyAndCount.length", data.length)
    return json({ data: returnData, count })
  } catch (error: any) {
    console.error("Search Error", error)
    return fail(401, { data: [], error: error.message ?? error })
  }
}
