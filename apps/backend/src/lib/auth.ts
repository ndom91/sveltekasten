import { verifyJwt } from "./jwt.js"
import { getCookie } from "hono/cookie"
import { HTTPException } from "hono/http-exception"
import { type Context } from "hono"

export async function verifyAuth(c: Context) {
  try {
    const cookieName = process.env.NODE_ENV !== "production" ? "authjs.session-token" : "__Secure-authjs.session-token"
    const cookie = getCookie(c, cookieName)!
    const decodedJwt = await verifyJwt(cookie)
    return decodedJwt?.sub
  } catch (error) {
    console.error(error)
    throw new HTTPException(401, { message: "Unauthorized" })
  }
}
