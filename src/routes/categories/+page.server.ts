import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  // @ts-expect-error
  const response = await prisma.post.findMany({
    where: { published: false },
    include: { author: true },
  })

  return { drafts: response };
};
