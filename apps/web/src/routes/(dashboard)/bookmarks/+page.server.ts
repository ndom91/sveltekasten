import { db } from "@briefkasten/db"
import { redirect } from "@sveltejs/kit"
import { fail } from "@sveltejs/kit"
import { formSchema as quickAddSchema } from "$schemas/quick-add"
import { formSchema as metadataSchema } from "$schemas/metadata-sidebar"
import { superValidate, message } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"
import { fetchBookmarkMetadata } from "$server/lib/fetchBookmarkMetadata"
import type { Actions, PageServerLoad } from "./$types"
import type { Tag } from "@briefkasten/db/types"

export const actions: Actions = {
  deleteBookmark: async ({ request, locals }) => {
    const session = await locals.auth()
    if (!session?.user?.id) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const data = await request.formData()
    const bookmarkId = data.get("bookmarkId")?.toString() || ""

    if (!bookmarkId) {
      return fail(400)
    }

    await db.bookmark.delete({
      where: {
        id: bookmarkId,
        userId: session.user.id,
      },
    })
    return { type: "success", message: "Deleted Bookmark" }
  },
  saveMetadata: async ({ request, locals }) => {
    const form = await superValidate(request, zod(metadataSchema), {
      id: "saveMetadataForm",
    })

    try {
      const session = await locals.auth()
      if (!session?.user?.id) {
        return fail(401, { type: "error", error: "Unauthenticated" })
      }

      if (!form.valid) {
        return fail(400, { type: "error", message: "Form invalid", metadataForm: form })
      }

      await db.bookmark.update({
        data: {
          title: form.data.title,
          desc: form.data.description,
          url: form.data.url,
          image: form.data.image,
          categoryId: form.data.category.id,
          tags: {
            deleteMany: {},
            connectOrCreate: form.data.tags.map((tag: Tag) => ({
              where: {
                bookmarkId_tagId: {
                  tagId: tag.id,
                  bookmarkId: form.data.id,
                },
              },
              create: {
                tag: {
                  connect: {
                    id: tag.id,
                  },
                },
              },
            })),
          },
        },
        where: {
          id: form.data.id,
          userId: session.user.id,
        },
      })

      return message(form, {
        text: "Bookmark Updated",
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error(error)
      }
      return { form, type: "error", error }
    }
  },
  quickAdd: async (event) => {
    const form = await superValidate(event.request, zod(quickAddSchema))
    if (!form.valid) {
      return fail(400, {
        form,
      })
    }

    try {
      const session = await event.locals.auth()
      if (!session?.user?.id) {
        return fail(401, { type: "error", error: "Unauthenticated" })
      }
      const { title, url, description, categoryId, tags } = form.data

      const bookmarkMetadata = await fetchBookmarkMetadata(url)

      const bookmark = await db.bookmark.create({
        data: {
          url,
          title: title,
          image: bookmarkMetadata.imageUrl,
          imageBlur: bookmarkMetadata.imageBlur,
          desc: description ? description : bookmarkMetadata.metadata.description,
          metadata: bookmarkMetadata.metadata,
          user: {
            connect: {
              id: session.user?.id,
            },
          },
          tags: tags
            ? {
                create: tags.map((tag: Tag) => ({
                  tag: {
                    connect: {
                      id: tag.id,
                    },
                  },
                })),
              }
            : {},
          category: categoryId
            ? {
                connect: {
                  id: categoryId,
                },
              }
            : {},
        },
      })

      return message(form, {
        bookmark: bookmark,
        text: "Bookmark Added!",
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error(error)
      }
      fail(500, { type: "error", message: "Failed to add bookmark" })
    }
  },
}

export const load: PageServerLoad = async (event) => {
  event.depends("app:bookmarks")
  const session = await event.locals?.auth()

  if (!session && event.url.pathname !== "/login") {
    const fromUrl = event.url.pathname + event.url.search
    redirect(303, `/login?redirectTo=${encodeURIComponent(fromUrl)}`)
  }

  try {
    const skip = Number(event.url.searchParams.get("skip") ?? "0")
    const limit = Number(event.url.searchParams.get("limit") ?? "20")

    const session = await event.locals.auth()
    if (!session?.user?.id) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }

    const [data, count] = await db.bookmark.findManyAndCount({
      take: limit + skip,
      skip: skip,
      where: {
        userId: session?.user?.id,
        archived: false,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const bookmarks = data.map((bookmark) => {
      return { ...bookmark, tags: bookmark.tags.map((tag) => tag.tag) }
    }) as LoadBookmarkFlatTags[]

    return {
      bookmarks: {
        data: bookmarks,
        count,
      },
      session,
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    return {
      bookmarks: {
        data: [],
        count: 0,
      },
      session,
      error,
    }
  }
}
