import prisma from "$lib/prisma";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, locals, url }) => {
  await parent()
  try {
    const session = await locals.getSession();
    if (!session?.user?.userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const skip = url.searchParams.get('skip') ?? "0";
    const limit = url.searchParams.get('limit') ?? "10";

    const [data, count] = await prisma.$transaction([
      prisma.feedEntry.findMany({
        take: parseInt(limit) + parseInt(skip),
        skip: parseInt(skip),
        where: { userId: session?.user?.userId },
        include: {
          feed: true,
          feedMedia: true,
        },
        orderBy: { published: "desc" },
      }),
      prisma.feedEntry.count({
        where: { userId: session?.user?.userId },
        orderBy: { published: "desc" },
      }),
    ])

    return {
      feedEntries: data,
      count
    };
  } catch (error) {
    let message
    if (typeof error === "string") {
      message = error.toUpperCase()
    } else if (error instanceof Error) {
      message = error.message
    }
    return { feedEntries: [], count: 0, error: message };
  }
};
