import prisma from "$lib/prisma";
import { fail } from "@sveltejs/kit";
import { formSchema } from "../schema";
import { superValidate } from "sveltekit-superforms/server";
import type { Actions } from "./$types"
import type { PageServerLoad } from './$types'

import splashy from "splashy"
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
    const session = await locals.getSession()
    if (!session?.user?.userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const data = await request.formData();
    const bookmarkId = data.get('bookmarkId')?.toString() || ''

    if (!bookmarkId) {
      return fail(400)
    }

    await prisma.bookmark.delete({
      where: {
        id: bookmarkId,
        userId: session.user.userId,
      }
    });
    return { type: "success", message: 'Deleted Bookmark' }
  },
  saveMetadataEdits: async ({ request, locals }) => {
    const session = await locals.getSession()
    if (!session?.user?.userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const data = await request.formData();

    const id = data.get('id')?.toString() || ''
    const title = data.get('title')?.toString() || ''
    const url = data.get('url')?.toString() || ''
    const desc = data.get('description')?.toString() || ''
    const categoryId = data.get('categoryId')?.toString() || ''
    // @TODO: Support updating image
    // const image = data.get('image')?.toString() || ''

    if (!id) {
      return fail(400, { type: 'error', message: 'Missing bookmark id' })
    }

    await prisma.bookmark.update({
      data: {
        title,
        desc,
        url,
        categoryId,
      },
      where: {
        id,
        userId: session.user.userId,
      }
    });

    return { type: "success", message: 'Updated Bookmark' }
  },
  quickAdd: async (event) => {
    const form = await superValidate(event, formSchema);
    if (!form.valid) {
      return fail(400, {
        form
      });
    }

    try {
      const session = await event.locals.getSession()
      if (!session?.user?.userId) {
        return fail(401, { type: "error", error: "Unauthenticated" })
      }
      const { userId } = session.user
      const { title, url, description, categoryId, tagIds: tagIdsString } = form.data
      const tagIds = tagIdsString?.length ? tagIdsString.split(',') : []

      const resp = await fetch(url)
      const metadata = await metascraperClient({ html: await resp.text(), url: url })
      const image = metadata.image ? metadata.image : metadata.logo as string

      const imageResponse = await fetch(image)
      const imageBuffer = await imageResponse.arrayBuffer()
      const palette = await splashy(Buffer.from(imageBuffer))

      metadata.palette = palette

      const bookmark = await prisma.bookmark.create({
        data: {
          url,
          title: title,
          image,
          desc: description ? description : metadata.description,
          metadata,
          user: {
            connect: {
              id: userId,
            },
          },
          tags: tagIds ? {
            create: tagIds.map((tagId) => ({
              tag: {
                connect: {
                  id: tagId
                }
              }
            }))
          } : {},
          category: categoryId
            ? {
              connect: {
                id: categoryId,
              },
            }
            : {},
        },
      })

      return {
        form,
        bookmark: bookmark,
        message: "Added Successfully",
        type: "success",
      };
    } catch (error) {
      console.error(error)
      fail(500, { type: "error", message: 'Failed to add bookmark' })
    }
  }
}

export const load: PageServerLoad = async ({ parent, locals, url }) => {
  await parent()
  try {
    const skip = Number(url.searchParams.get('skip') ?? "0")
    const limit = Number(url.searchParams.get('limit') ?? "10")

    const session = await locals.getSession();
    if (!session?.user?.userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }

    const [data, count] = await prisma.bookmark.findManyAndCount({
      take: limit + skip,
      skip: skip,
      where: { userId: session?.user?.userId },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return {
      bookmarks: data,
      count,
    };
  } catch (error) {
    let message
    if (typeof error === "string") {
      message = error
    } else if (error instanceof Error) {
      message = error.message
    }
    return { bookmarks: [], count: 1, error: message }
  }
};
