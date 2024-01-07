import type { LayoutServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "../schema";

export const load: LayoutServerLoad = async () => {
  return {
    form: await superValidate(formSchema),
  };
};
