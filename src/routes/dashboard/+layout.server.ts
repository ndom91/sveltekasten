import type { LayoutServerLoad } from './$types'
import { redirect } from '@sveltejs/kit';
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "../schema";

export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.getSession();

  if (!session && event.url.pathname !== '/login') {
    throw redirect(307, 'login');
  }

  return {
    form: await superValidate(formSchema),
    session
  };
};
