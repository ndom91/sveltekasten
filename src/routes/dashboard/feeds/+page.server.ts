import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, locals, url }) => {
  await parent()
  try {
    const session = await locals.getSession();
    const skip = url.searchParams.get('skip') ?? "0";
    const limit = url.searchParams.get('limit') ?? "10";
    console.log("skip", { limit, skip });

    const feedEntriesResponse = await prisma.feedEntry.findMany({
      take: parseInt(limit + skip),
      skip: parseInt(skip),
      where: { userId: session?.user?.userId },
      include: {
        feed: true,
        feedMedia: true,
        _count: true
      },
      orderBy: { published: "desc" },
    });

    return {
      feedEntries: feedEntriesResponse,
    };
  } catch (error) {
    let message
    if (typeof error === "string") {
      message = error.toUpperCase() // works, `e` narrowed to string
    } else if (error instanceof Error) {
      message = error.message // works, `e` narrowed to Error
    }
    return { feedEntries: [], error: message };
  }
};
