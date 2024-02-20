import { redirect } from "@sveltejs/kit"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.auth()

  if (!session && event.url.pathname !== "/login") {
    const fromUrl = event.url.pathname + event.url.search
    redirect(307, `/login?redirectTo=${encodeURIComponent(fromUrl)}`)
  }

  // If there is a session, don't let the user stay on "/"
  if (session?.user && event.url.pathname == "/login") {
    const redirectTo = event.url.searchParams.get("redirectTo")
    if (redirectTo) {
      redirect(303, `/${decodeURIComponent(redirectTo).slice(1)}`)
    }
    redirect(303, `/`)
  }

  return {
    session,
  }
}
