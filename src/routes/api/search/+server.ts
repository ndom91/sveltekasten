import type { RequestHandler } from './$types';
import { json, fail } from '@sveltejs/kit';

import prisma from "$lib/prisma";

// @ts-expect-error
export const POST: RequestHandler = async ({ request, locals }) => {
  const session = await locals.getSession()
  if (!session?.user?.userId) {
    return fail(401, { type: "error", error: "Unauthenticated" })
  }

  const { query, type = 'feedEntry' } = await request.json();

  // @ts-expect-error
  const result = await prisma[type].findMany({
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
    // take: parseInt(limit + skip),
    // skip: parseInt(skip),
    include: {
      feed: true,
      feedMedia: true,
      _count: true
    },
    orderBy: { published: "desc" },
  })

  return json(result);
}
