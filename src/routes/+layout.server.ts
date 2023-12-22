import type { LayoutServerLoad } from './$types'
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.getSession();

  if (!session && event.url.pathname !== '/login') {
    throw redirect(307, 'login');
  }

  return {
    session: {
      ...session
    }
  };
};
