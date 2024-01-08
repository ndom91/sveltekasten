import type { RequestHandler } from './$types';
import { json, fail } from '@sveltejs/kit';

import prisma from "$lib/prisma";

// @ts-expect-error
export const POST: RequestHandler = async ({ request, locals, url }) => {
  const session = await locals.getSession()
  if (!session?.user?.userId) {
    return fail(401, { type: "error", error: "Unauthenticated" })
  }

  const skip = Number(url.searchParams.get('skip') ?? "0")
  const limit = Number(url.searchParams.get('limit') ?? "10")
  const { query, type = 'feedEntry' } = await request.json();

  // @TODO: Make fields dynamic depending on what schema is being searched
  const [data, count] = await prisma.$transaction([
    // @ts-expect-error
    prisma[type].findMany({
      where: {
        title: {
          search: query,
        },
        link: {
          search: query,
        },
        content: {
          search: query,
        },
        userId: session?.user?.userId
      },
      take: limit + skip,
      skip: skip,
      include: {
        feed: true,
        feedMedia: true,
        _count: true
      },
      orderBy: { published: "desc" },
    }),
    // @ts-expect-error
    prisma[type].count({
      where: {
        title: {
          search: query,
        },
        link: {
          search: query,
        },
        content: {
          search: query,
        },
        userId: session?.user?.userId
      },
      take: limit + skip,
      skip: skip,
      orderBy: { published: "desc" },
    })
  ])

  return json({ data, count });
}
