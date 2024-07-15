import { getCookie } from "hono/cookie"
import { HTTPException } from "hono/http-exception"
import { db } from "../plugins/prisma.js"
import type { Context } from "hono"
import debugFactory from "./log.js"

const getSession = async (sessionToken: string) => {
  return db.session.findFirst({
    where: {
      sessionToken,
      expires: {
        gte: new Date(),
      },
    },
    select: {
      userId: true,
    },
  })
}

const debug = debugFactory("backend:auth")

export async function getUserId(c: Context) {
  try {
    const cookieName
      = process.env.NODE_ENV !== "production"
        ? "authjs.session-token"
        : "__Secure-authjs.session-token"
    const cookieValue = getCookie(c, cookieName)!
    debug("Parsing cookies", { cookieName, cookieValue })

    const session = await getSession(cookieValue)
    if (!session) return null

    return session.userId
  } catch (error) {
    console.error(error)
    throw new HTTPException(401, { message: "Unauthorized" })
  }
}
