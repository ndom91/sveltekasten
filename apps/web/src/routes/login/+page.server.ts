import { providerMap, signIn } from "../../auth"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = ({ url }) => {
  const redirectTo = url.searchParams.get("redirectTo")
  return {
    providers: providerMap,
    redirectTo,
  }
}

export const actions: Actions = {
  default: signIn,
}
