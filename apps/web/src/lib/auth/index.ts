import { type RequestEvent, error, fail } from "@sveltejs/kit"
import type { Session } from "$lib/auth-client"

export const isAuthenticated = (event: RequestEvent): Session | never => {
  const { session, user } = event.locals

  if (session === null || session.userId === undefined) {
    if (event.request.formData === undefined) {
      // For form actions
      error(401, { message: "You are not logged in." })
    } else {
      // For API handlers
      fail(401, { message: "You are not logged in." })
    }
  }

  return {
    session,
    user,
  }
}
