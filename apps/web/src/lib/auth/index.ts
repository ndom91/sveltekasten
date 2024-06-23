import { type RequestEvent, error, fail } from "@sveltejs/kit"
import type { Session } from "@auth/sveltekit"

export const isAuthenticated = async (event: RequestEvent): Promise<Session> | never => {
  const session = await event.locals.auth()

  console.log("isAuthenicated.formData?", !!event.request.formData)
  if (session === null || session.user === undefined || session.user.email === null) {
    if (event.request.formData === undefined) {
      error(401, { message: "You are not logged in." })
    } else {
      fail(401, { message: "You are not logged in." })
    }
  }

  // return session as Session & { user: { email: string } }
  return session as Session
}
