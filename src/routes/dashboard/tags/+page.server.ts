import prisma from "$lib/prisma";
import type { Actions } from "../$types"
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const session = await locals.getSession()
    const data = await request.formData();

    let title = data.get("title")
    let content = data.get("content")
    let authorEmail = data.get("authorEmail")

    if (!title || !content || !authorEmail) {
      return fail(400, { content, authorEmail, title, missing: true });
    }

    await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { email: authorEmail } }
      },
    });

    throw redirect(303, `/drafts`)
  }
};
