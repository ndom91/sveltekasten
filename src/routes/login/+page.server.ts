import { providerMap } from "../../auth"
import type { PageServerLoad } from "./$types"
import { signIn } from "../../auth"
import type { Actions } from "./$types"

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
