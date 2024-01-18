import type { LayoutServerLoad } from "./$types"
import { redirect } from "@sveltejs/kit"

export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.getSession()

  if (!session && event.url.pathname !== "/login") {
    const fromUrl = event.url.pathname + event.url.search
    throw redirect(307, `/login?redirectTo=${encodeURIComponent(fromUrl)}`)
  }

  // If there is a session, don't let the user stay on "/"
  if (session?.user && event.url.pathname == "/") {
    throw redirect(303, `/dashboard`)
  }

  return {
    session,
  }
}
