import prisma from "$lib/prisma";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Feed, FeedEntry } from "$zod";

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

    const [feedEntryData, feedEntryCount] = await prisma.feedEntry.findManyAndCount({
      take: limit + skip,
      skip: skip,
      where: { userId: session?.user?.userId },
      include: {
        feed: true,
        feedMedia: true,
      },
      orderBy: { published: "desc" },
    });

    const [feedData, feedCount] = await prisma.feed.findManyAndCount({
      where: { userId: session?.user?.userId },
      select: {
        id: true,
        name: true,
        url: true,
        description: true,
        language: true,
        userId: true,
        lastFetched: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            feedEntries: { where: { unread: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      feedEntries: {
        data: feedEntryData,
        count: feedEntryCount
      },
      feeds: {
        data: feedData.map((feed) => {
          return {
            ...feed,
            visible: true
          } as unknown as Feed & { visible: boolean }
        }),
        count: feedCount
      }
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
