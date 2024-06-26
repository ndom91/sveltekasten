import { type RequestEvent, error, fail } from "@sveltejs/kit"
import type { Session } from "@auth/sveltekit"

export const isAuthenticated = async (event: RequestEvent): Promise<Session> | never => {
  const session = await event.locals.auth()

  if (session === null || session.user === undefined || session.user.email === null) {
    if (event.request.formData === undefined) {
      // For form actions
      error(401, { message: "You are not logged in." })
    } else {
      // For API handlers
      fail(401, { message: "You are not logged in." })
    }
  }

  return session as Session
}
