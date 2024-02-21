import { fail } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { createEdgeSpeech } from "$lib/server/generate-tts"

// @ts-expect-error
export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.auth()
    if (!session?.user?.userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
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
  } catch (error: any) {
    return fail(401, { data: [], error: error.message ?? error })
  }
}
