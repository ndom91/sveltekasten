import type { Actions } from './$types'
import { fail, error } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms/server";
import { formSchema } from "../schema";
import prisma from '$lib/prisma';

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, formSchema);
    if (!form.valid) {
      return fail(400, {
        form
      });
    }

    try {
      const session = await event.locals.getSession()
      const { title, url, description, category, tags } = form.data
      const { userId } = session.user

      const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}&palette=true&audio=true&video=true`)
      const metadataResponse = await res.json()
      const metadata = metadataResponse.data

      console.log('URL METADATA', metadata)

      const upsertBookmarkRes = await prisma.bookmark.upsert({
        include: {
          category: true,
        },
        create: {
          url,
          title: title,
          // title: title ? title : metadata.title,
          image: metadata.image.url,
          // imageBlur: metadata.imageBlur,
          desc: description?.length ? description : metadata.description,
          // desc: description,
          metadata,
          user: {
            connect: {
              id: userId,
            },
          },
          category: category
            ? {
              connect: {
                name_userId: {
                  name: category,
                  userId,
                },
              },
            }
            : {},
        },
        update: {
          url,
          // title: title.length ? title : metadata.title,
          // image: metadata.image,
          // imageBlur: metadata.imageBlur,
          // desc: desc.length ? desc : metadata.description,
          title,
          metadata,
          desc: description,
          category: category
            ? {
              connect: {
                name_userId: {
                  name: category,
                  userId,
                },
              },
            }
            : {},
        },
        where: { url_userId: { url: url, userId: userId } },
      })

      let upsertTagRes
      // Next, if there are tags, insert them sequentially
      if (tags && tags.filter(Boolean).length) {
        upsertTagRes = await Promise.all(
          tags.map(async (tag) => {
            return await prisma.tag.upsert({
              create: {
                name: tag,
                userId,
              },
              update: {
                name: tag,
              },
              where: {
                name_userId: {
                  name: tag,
                  userId,
                },
              },
            })
          }),
        )

        // Finally, link the tags to bookmark in intermediate join table
        await Promise.all(
          upsertTagRes.map((tag) => {
            return prisma.tagsOnBookmarks.upsert({
              create: {
                bookmarkId: upsertBookmarkRes.id,
                tagId: tag.id,
              },
              update: {
                bookmarkId: upsertBookmarkRes.id,
                tagId: tag.id,
              },
              where: {
                bookmarkId_tagId: {
                  bookmarkId: upsertBookmarkRes.id,
                  tagId: tag.id,
                },
              },
            })
          }),
        )
      }

      return {
        form,
        bookmark: upsertBookmarkRes
      };
    } catch (err) {
      console.error(err)
      error(500, { message: 'Failed to add bookmark' })
    }
  }
};
