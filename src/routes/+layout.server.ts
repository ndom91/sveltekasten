import type { Actions, LayoutServerLoad } from './$types'
import { redirect } from '@sveltejs/kit';
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";

export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.getSession();

  if (!session && event.url.pathname !== '/login') {
    throw redirect(307, 'login');
  }

  return {
    form: superValidate(formSchema),
    session: {
      ...session
    }
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, formSchema);
    if (!form.valid) {
      return fail(400, {
        form
      });
    }
    return {
      form
    };
  }
};
