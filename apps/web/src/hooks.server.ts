import type { Handle } from "@sveltejs/kit"
import { dev } from "$app/environment"
import { sequence } from "@sveltejs/kit/hooks"
import { handle as handleAuth } from "./auth"
import { providerMap } from "./auth"

const logger: Handle = async ({ event, resolve }) => {
  if (!dev) {
    return resolve(event)
  }
  const start_time = Date.now()

  // Wait on response, run other hooks and load
  const response = await resolve(event)

  const clientAddress = event.getClientAddress() ?? "unknown"

  console.log(
    `${response.status} ${event.request.method} from ${clientAddress} ${event.url.pathname} (${Date.now() - start_time}ms)`,
  )

  return response
}

const handleLoginProviders: Handle = async ({ event, resolve }) => {
  if (event.route.id === "/login") {
    event.locals.providers = providerMap.map((provider) => ({
      id: provider.id as string,
      name: provider.name,
    }))
  }
  return resolve(event)
}

export const handle = sequence(logger, handleAuth, handleLoginProviders)
