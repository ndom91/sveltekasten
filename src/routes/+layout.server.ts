import { page, navigating } from '$app/stores';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
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
