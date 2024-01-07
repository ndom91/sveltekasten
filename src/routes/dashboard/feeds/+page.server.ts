import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  try {
    const session = await event.locals.getSession();

    const feedEntriesResponse = await prisma.feedEntry.findMany({
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
