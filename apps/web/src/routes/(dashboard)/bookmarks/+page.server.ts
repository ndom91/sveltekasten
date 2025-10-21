import { fail, redirect } from "@sveltejs/kit"
import { message, superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"
import type { z } from "zod"
import { PUBLIC_WORKER_URL } from "$env/static/public"
import { isAuthenticated } from "$lib/auth"
import { db } from "$lib/prisma"
import { fetchBookmarkMetadata } from "$lib/server/fetchBookmarkMetadata"
import type { Tag } from "$lib/types/zod.js"
import { formSchema as metadataSchema } from "$schemas/metadata-sidebar"
import { formSchema as quickAddSchema } from "$schemas/quick-add"
import type { Actions, PageServerLoad } from "./$types"

type MetadataFormData = z.infer<typeof metadataSchema>
type QuickAddFormData = z.infer<typeof quickAddSchema>

export const actions: Actions = {
  deleteBookmark: async (event) => {
    const { session } = isAuthenticated(event)
    const data = await event.request.formData()
    const bookmarkId = data.get("bookmarkId")?.toString() || ""

    if (!bookmarkId) {
      return fail(400)
    }

    await db.bookmark.delete({
      where: {
        id: bookmarkId,
        userId: session.userId,
      },
    })

    // TODO: Delete Image from Object Storage

    return { type: "success", message: "Deleted Bookmark" }
  },
  saveMetadata: async (event) => {
    const form = await superValidate(event.request, zod(metadataSchema), {
      id: "saveMetadataForm",
    })

    try {
      const { session } = isAuthenticated(event)

      if (!form.valid) {
        return fail(400, {
          type: "error",
          message: "Form invalid",
          metadataForm: form,
        })
      }

      const formData = form.data as MetadataFormData

      await db.bookmark.update({
        data: {
          title: formData.title,
          desc: formData.description,
          url: formData.url,
          image: formData.image,
          category: formData.category
            ? {
                connect: {
                  id: formData.category,
                },
              }
            : {
                disconnect: true,
              },
          tags: {
            deleteMany: {},
            connectOrCreate: formData.tags.map((tag: Tag) => ({
              where: {
                bookmarkId_tagId: {
                  tagId: tag.id,
                  bookmarkId: formData.id,
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
          id: formData.id,
          userId: session.userId,
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
      const session = event.locals.session
      if (!session?.userId) {
        return fail(401, { type: "error", error: "Unauthenticated" })
      }
      const formData = form.data as QuickAddFormData
      const { title, url, description, categoryId, tags } = formData

      const bookmarkMetadata = await fetchBookmarkMetadata(url)

      const bookmark = await db.bookmark.create({
        data: {
          url,
          title,
          image: bookmarkMetadata.imageUrl,
          imageBlur: bookmarkMetadata.imageBlur,
          desc: description || bookmarkMetadata.metadata.description,
          metadata: bookmarkMetadata.metadata,
          user: {
            connect: {
              id: session.userId,
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

      // Add bookmark to queue for fetching screenshot
      if (PUBLIC_WORKER_URL) {
        await event.fetch(`${PUBLIC_WORKER_URL}/v1/bookmark`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: [{ url }] }),
        })
      }

      return message(form, {
        bookmark,
        text: "Bookmark Added!",
      })
    } catch (error) {
      console.error(String(error))
      fail(500, { type: "error", message: "Failed to add bookmark" })
    }
  },
}

export const load: PageServerLoad = async (event) => {
  event.depends("app:bookmarks")
  const session = event.locals?.session

  if (!session && event.url.pathname !== "/login") {
    const fromUrl = event.url.pathname + event.url.search
    redirect(303, `/login?redirectTo=${encodeURIComponent(fromUrl)}`)
  }

  try {
    // const skip = Number(event.url.searchParams.get("skip") ?? "0")
    // const limit = Number(event.url.searchParams.get("limit") ?? "20")

    if (!session?.userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }

    // const [data, count] = (await db.bookmark.findManyAndCount({
    //   take: limit + skip,
    //   skip,
    //   where: {
    //     userId: session?.userId,
    //     archived: false,
    //   },
    //   include: {
    //     category: true,
    //     tags: { include: { tag: true } },
    //   },
    //   orderBy: { createdAt: "desc" },
    // })) as unknown as [LoadBookmark[], number]
    //
    // const bookmarks = data.map((bookmark) => {
    //   return { ...bookmark, tags: bookmark.tags.map((tag) => tag.tag) }
    // }) as LoadBookmarkFlatTags[]

    return {
      // bookmarks: {
      //   data: bookmarks,
      //   count,
      // },
      session,
    }
  } catch (error) {
    console.error(String(error))

    return {
      // bookmarks: {
      //   data: [],
      //   count: 0,
      // },
      session,
      error,
    }
  }
}
