import { signIn } from "../../auth"
import type { Actions } from "./$types"

export const actions = {
  default: async (e) => {
    const res = await signIn(e)
    console.log("signin.server.action.res", res)
    return res
  },
} satisfies Actions

// export const actions = { default: signIn } satisfies Actions
