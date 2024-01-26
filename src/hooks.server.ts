import type { Handle } from "@sveltejs/kit"
import { dev } from "$app/environment"
import { sequence } from "@sveltejs/kit/hooks"
import { handle as handleAuth } from "./auth"

const logger: Handle = async ({ event, resolve }) => {
  if (!dev) {
    return resolve(event)
  }
  const start_time = Date.now()
  // Wait on response, run other hooks and load
  const response = await resolve(event)
  // console.log(response)

  console.log(
    `${response.status} ${event.request.method} ${event.url.pathname} (${Date.now() - start_time}ms)`,
  )

  return response
}

const handleGlobal: Handle = async ({ event, resolve }) => {
  // @ts-expect-error
  // event.locals.providers = providers.map((provider) => ({
  //   id: provider.id as string,
  //   name: provider.name,
  // }))
  const response = await resolve(event)
  return response
}

export const handle = sequence(logger, handleAuth) //, handleGlobal)
