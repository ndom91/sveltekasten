import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession()

  const response = await prisma.category.findMany({
    where: { userId: session.user.userId }
  })

  return { categories: response };
};
