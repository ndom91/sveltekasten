import { text } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { createEdgeSpeech } from "$lib/server/generate-tts"

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.auth()
    if (!session?.user?.id) {
      return new Response(null, { status: 401, statusText: "Unauthorized" })
    }

    const { text, speaker } = await request.json()

    const edgeSpeech = await createEdgeSpeech({
      payload: {
        input: text,
        options: {
          voice: speaker,
        },
      },
    })

    return edgeSpeech
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    return new Response(String(error), { status: 401 })
  }
}

export const fallback: RequestHandler = async ({ request }) => {
  return text(`Invalid method ${request.method}`)
}
