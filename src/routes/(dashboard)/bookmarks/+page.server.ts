import prisma from "$lib/prisma"
import { redirect } from "@sveltejs/kit"
import { fail } from "@sveltejs/kit"
import { formSchema as quickAddSchema } from "$schemas/quick-add"
import { formSchema as metadataSchema } from "$schemas/metadata-sidebar"
import { superValidate, message } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"
import { getThumbhashNode } from "$lib/utils/thumbhash"
import type { Actions } from "./$types"
import type { PageServerLoad } from "./$types"

import metascraper from "metascraper"
import metascraperDescription from "metascraper-description"
import metascraperTitle from "metascraper-title"
import metascraperClearbit from "metascraper-clearbit"
import metascraperImage from "metascraper-image"
import metascraperLogo from "metascraper-logo"
import metascraperLogoFavicon from "metascraper-logo-favicon"
import metascraperLang from "metascraper-lang"
import metascraperPublisher from "metascraper-publisher"
import metascraperAuthor from "metascraper-author"
import metascraperFeed from "metascraper-feed"
import metascraperDate from "metascraper-date"
import metascraperUrl from "metascraper-url"
import metascraperReadability from "metascraper-readability"

const metascraperClient = metascraper([
  metascraperDescription(),
  metascraperTitle(),
  metascraperClearbit(),
  metascraperLogo(),
  metascraperImage(),
  metascraperLogoFavicon(),
  metascraperLang(),
  metascraperPublisher(),
  metascraperAuthor(),
  metascraperFeed(),
  metascraperReadability(),
  metascraperDate(),
  metascraperUrl(),
])

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

    await prisma.bookmark.delete({
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

      await prisma.bookmark.update({
        data: {
          title: form.data.title,
          desc: form.data.description,
          url: form.data.url,
          image: form.data.image,
          categoryId: form.data.category.id,
          tags: {
            deleteMany: {},
            connectOrCreate: form.data.tags.map((tag) => ({
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
      const { userId } = session.user
      const { title, url, description, categoryId, tags } = form.data

      const bookmarkUrlResponse = await fetch(url)
      const metadata = await metascraperClient({ html: await bookmarkUrlResponse.text(), url: url })
      const imageUrl = metadata.image ? metadata.image : (metadata.logo as string)

      // Continue bookmark saving when sharp or anything chokes on an image
      let b64Thumbhash = ""
      try {
        b64Thumbhash = await getThumbhashNode(imageUrl)
      } catch (error) {
        if (error instanceof Error) {
          console.error("Failed to get thumbhash", error.message)
        } else {
          console.error("Failed to get thumbhash", error)
        }
      }

      const bookmark = await prisma.bookmark.create({
        data: {
          url,
          title: title,
          image: imageUrl,
          imageBlur: b64Thumbhash,
          desc: description ? description : metadata.description,
          metadata,
          user: {
            connect: {
              id: userId,
            },
          },
          tags: tags
            ? {
              create: tags.map((tag) => ({
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
  const session = await event.locals?.auth()

  if (!session && event.url.pathname !== "/login") {
    const fromUrl = event.url.pathname + event.url.search
    redirect(303, `/login?redirectTo=${encodeURIComponent(fromUrl)}`)
  }

  try {
    const skip = Number(event.url.searchParams.get("skip") ?? "0")
    const limit = Number(event.url.searchParams.get("limit") ?? "10")

    const session = await event.locals.auth()
    if (!session?.user?.id) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }

    const [data, count] = await prisma.bookmark.findManyAndCount({
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
    })

    return {
      bookmarks,
      count,
      session,
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    return {
      bookmarks: [],
      count: 1,
      error,
    }
  }
}
