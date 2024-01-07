import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, locals, url }) => {
  await parent()
  try {
    const session = await locals.getSession();
    const skip = url.searchParams.get('skip') ?? "0";
    const limit = url.searchParams.get('limit') ?? "10";

    const feedEntriesResponse = await prisma.feedEntry.findMany({
      take: parseInt(limit + skip),
      skip: parseInt(skip),
      where: { userId: session?.user?.userId },
      include: {
        feed: true,
        feedMedia: true,
      },
      orderBy: { published: "desc" },
    });

    return {
      feedEntries: feedEntriesResponse,
    };
  } catch (error) {
    return { feedEntries: [], error: error.message };
  }
};
