import { text } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { saveBookmark } from "$lib/utils/save-bookmark"

export const GET: RequestHandler = async (event) => {
  try {
    const url = event.url.searchParams.get("url")
    if (!url) throw new Error("No URL provided")

    console.log("PASSED_URL", url)

    await saveBookmark([{ url }])

    return Response.redirect("/")
  } catch (error) {
    console.error(String(error))
    return new Response(String(error), { status: 401 })
  }
}

export const fallback: RequestHandler = async ({ request }) => {
  return text(`Invalid method ${request.method}`)
}
