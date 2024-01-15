import type { RequestHandler } from "./$types"
import { json, fail } from "@sveltejs/kit"
import prisma from "$lib/prisma"

type RequestBody = {
  where: Record<string, unknown>
  include: Record<string, unknown>
  orderBy: Record<string, Record<string, string>>
  type: "feedEntry" | "bookmark"
}

// @ts-expect-error
export const POST: RequestHandler = async ({ request, locals, url }) => {
  const session = await locals.getSession()
  if (!session?.user?.userId) {
    return fail(401, { type: "error", error: "Unauthenticated" })
  }

  const skip = Number(url.searchParams.get("skip") ?? "0")
  const limit = Number(url.searchParams.get("limit") ?? "10")
  const { where, include, orderBy, type = "feedEntry" } = (await request.json()) as RequestBody

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

  return json({ data, count })
}
