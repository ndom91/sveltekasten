import { verifyJwt } from "./jwt.js"
import { getCookie } from "hono/cookie"
import { db } from "../plugins/prisma.js"
import { HTTPException } from "hono/http-exception"
import { type Context } from "hono"

const SESSION_STRATEGY: "database" | "jwt" = "database"

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

export async function verifyAuth(c: Context) {
  try {
    const cookieName = process.env.NODE_ENV !== "production" ? "authjs.session-token" : "__Secure-authjs.session-token"
    const cookieValue = getCookie(c, cookieName)!

    if (SESSION_STRATEGY === "jwt") {
      const decodedJwt = await verifyJwt(cookieValue)
      return decodedJwt?.sub
    } else if (SESSION_STRATEGY === "database") {
      const session = await getSession(cookieValue)
      if (!session) return null
      return session.userId
    }
  } catch (error) {
    console.error(error)
    throw new HTTPException(401, { message: "Unauthorized" })
  }
}
