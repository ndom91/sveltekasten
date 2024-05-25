import { getCookie } from "hono/cookie"
import { HTTPException } from "hono/http-exception"
import type { Context } from "hono"
import debugFactory from "./log.js"
import { verifyJwt } from "./jwt.js"

const debug = debugFactory("backend:auth")

export async function getUserId(c: Context) {
  try {
    const cookieName
      = process.env.NODE_ENV !== "production"
        ? "authjs.session-token"
        : "__Secure-authjs.session-token"
    const cookieValue = getCookie(c, cookieName)!

    debug("Parsing cookies", { cookieName, cookieValue })

    const decodedJwt = await verifyJwt(cookieValue)
    debug("Decoded JWT.sub", { id: decodedJwt?.sub })
    return decodedJwt?.sub
  } catch (error) {
    console.error(error)
    throw new HTTPException(401, { message: "Unauthorized" })
  }
}
