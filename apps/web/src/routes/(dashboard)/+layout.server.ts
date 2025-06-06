import { fail } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"
import { db } from "$lib/prisma"
import { formSchema } from "$schemas/quick-add"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ locals }) => {
  let quickAddForm
  try {
    quickAddForm = await superValidate(zod(formSchema), {
      id: "quickAddForm",
    })
    const session = await locals.auth()
    if (!session?.user?.id) {
      fail(401, { type: "error", error: "Unauthenticated" })
    }
    const [categories, tags] = await db.$transaction([
      db.category.findMany({
        where: { userId: session?.user?.id },
      }),
      db.tag.findMany({
        where: { userId: session?.user?.id },
      }),
    ])

    const [bookmarkData, bookmarkCount] = (await db.bookmark.findManyAndCount({
      take: 10,
      skip: 0,
      where: {
        userId: session?.user?.id,
        archived: false,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    })) as unknown as [LoadBookmark[], number]

    const bookmarks = bookmarkData.map((bookmark) => {
      return { ...bookmark, tags: bookmark.tags.map((tag) => tag.tag) }
    }) as LoadBookmarkFlatTags[]

    const [feedEntryData, feedEntryCount] = await db.feedEntry.findManyAndCount({
      take: 10,
      skip: 0,
      where: { userId: session?.user?.id },
      include: {
        feed: true,
        feedMedia: true,
      },
      orderBy: { published: "desc" },
    })

    const [feedData, feedCount] = await db.feed.findManyAndCount({
      where: { userId: session?.user?.id },
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
    })

    return {
      bookmarks: {
        data: bookmarks,
        count: bookmarkCount,
      },
      feedEntries: {
        data: feedEntryData,
        count: feedEntryCount ?? 0,
      },
      feeds: {
        data: feedData.map((feed) => {
          return {
            ...feed,
            visible: true,
          }
        }) as unknown as (LoadFeed & { visible: boolean })[],
        count: feedCount ?? 0,
      },
      quickAddForm,
      tags,
      categories: categories.map((category) => ({ ...category, visible: true })),
    }
  } catch (error) {
    console.error(String(error))
    return {
      categories: [],
      tags: [],
      error,
      quickAddForm,
    }
  }
}
