import { sequence } from "@sveltejs/kit/hooks"
import { handle as handleAuth, providerMap } from "./auth"
import type { Handle } from "@sveltejs/kit"
import { dev } from "$app/environment"

function getStatusColor(statusCode: string): string {
  switch (true) {
    case /^4\d{2}$/.test(statusCode):
      return "\x1B[31m"
    case /^5\d{2}$/.test(statusCode):
      return "\x1B[31m"
    case /^3\d{2}$/.test(statusCode):
      return "\x1B[33m"
    case /^2\d{2}$/.test(statusCode):
      return "\x1B[32m"
    default:
      return "green"
  }
}

const logger: Handle = async ({ event, resolve }) => {
  if (!dev) {
    return resolve(event)
  }
  const start_time = Date.now()

  // Wait on response, run other hooks and load
  const response = await resolve(event)

  const statusColor = getStatusColor(`${response.status}`)

  // Debug requests
  // const requestIp = event.getClientAddress()
  // console.log("req", requestIp)

  console.log(
    `${statusColor}${response.status}\x1B[0m ${event.request.method} \x1B[1m${event.url.pathname}\x1B[0m (\x1B[90m${Date.now() - start_time}ms\x1B[0m)`,
  )

  return response
}

const handleEmailVerifyRedirect: Handle = ({ event, resolve }) => {
  if (event.url.pathname === "/auth/verify-request") {
    return new Response("", { status: 302, headers: { Location: "/login?verifyEmail=true" } })
  }
  return resolve(event)
}

const handleLoginProviders: Handle = async ({ event, resolve }) => {
  if (event.route.id === "/login") {
    event.locals.providers = providerMap.map((provider) => ({
      id: provider.id,
      name: provider.name,
    }))
  }
  return resolve(event)
}

const rateLimitMap = new Map()

const handleRateLimit: Handle = async ({ event, resolve }) => {
  if (dev) {
    return resolve(event)
  }
  const ip = event.getClientAddress()
  const limit = 150 // Requests per window
  const windowMs = 60 * 1000 * 1 // minutes

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, {
      count: 0,
      lastReset: Date.now(),
    })
  }

  const ipData = rateLimitMap.get(ip)

  if (Date.now() - ipData.lastReset > windowMs) {
    ipData.count = 0
    ipData.lastReset = Date.now()
  }

  if (ipData.count >= limit) {
    return new Response("Too Many Requests", { status: 429 })
  }

  ipData.count += 1

  return resolve(event)
}

export const handle = sequence(
  logger,
  handleRateLimit,
  handleEmailVerifyRedirect,
  handleAuth,
  handleLoginProviders,
)
