import { auth } from "../../auth"
import type { Actions } from "./$types"

export const actions = auth.api.getActions(["signOut"])
