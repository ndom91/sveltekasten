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
    const skip = Number(url.searchParams.get('skip') ?? "0")
    const limit = Number(url.searchParams.get('limit') ?? "10")

    if (limit > 100) {
      return fail(401, { type: "error", error: "Attempted to load too many items" })
    }

    const [data, count] = await prisma.feedEntry.findManyAndCount({
      take: limit + skip,
      skip: skip,
      where: { userId: session?.user?.userId },
      include: {
        feed: true,
        feedMedia: true,
      },
      orderBy: { published: "desc" },
    });

    return {
      feedEntries: data,
      count
    };
  } catch (error) {
    let message
    if (typeof error === "string") {
      message = error
    } else if (error instanceof Error) {
      message = error.message
    }
    return { feedEntries: [], count: 0, error: message };
  }
};
