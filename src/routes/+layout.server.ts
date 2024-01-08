import type { LayoutServerLoad } from './$types'
import { redirect } from '@sveltejs/kit';
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";

export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.getSession();

  if (!session && event.url.pathname !== '/login') {
    const fromUrl = event.url.pathname + event.url.search
    throw redirect(307, `/login?redirectTo=${encodeURIComponent(fromUrl)}`);
  }

  return {
    form: await superValidate(formSchema),
    session
  };
};
