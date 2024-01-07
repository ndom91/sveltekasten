import { json } from '@sveltejs/kit';
import { fail } from "@sveltejs/kit";
import prisma from "$lib/prisma";

export async function POST({ request, locals }) {
  const session = await locals.getSession()
  if (!session?.user?.userId) {
    return fail(401, { type: "error", error: "Unauthenticated" })
  }

  const { query, type = 'feedEntry' } = await request.json();
  const result = await prisma[type].findMany({
    where: {
      title: {
        search: query,
      },
      link: {
        search: query,
      },
      content: {
        search: query,
      },
    },
  })


  return json(result);
}
