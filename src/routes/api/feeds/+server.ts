import type { RequestHandler } from './$types';
import { json, fail } from '@sveltejs/kit';
import prisma from "$lib/prisma";

// @ts-expect-error
export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.getSession()
    if (!session?.user?.userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const responseJson = await request.json();
    const skip = Number(responseJson.skip ?? "0")
    const limit = Number(responseJson.limit ?? "10")

    if (limit > 100) {
      return fail(401, { type: "error", error: "Attempted to load too many items" })
    }

    const data = await prisma.feedEntry.findMany({
      take: limit,
      skip: skip,
      where: { userId: session?.user?.userId },
      include: {
        feed: true,
        feedMedia: true,
      },
      orderBy: { published: "desc" },
    });

    return json({
      data,
    })
  } catch (error) {
    let message
    if (typeof error === "string") {
      message = error.toUpperCase()
    } else if (error instanceof Error) {
      message = error.message
    }
    return fail(401, { data: [], error: message })
  }
}
