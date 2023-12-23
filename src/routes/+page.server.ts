import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
  const session = await event.locals.getSession();
  
  const response = await prisma.bookmark.findMany({
    where: { userId: session.user.userId },
  })

  return { bookmarks: response };
};
