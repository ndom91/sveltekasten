import { getCookie } from "hono/cookie"
import { HTTPException } from "hono/http-exception"
import type { Context } from "hono"
// import { db } from "../plugins/prisma.js"
import debugFactory from "./log.js"
import { verifyJwt } from "./jwt.js"

const debug = debugFactory("backend:auth")

const AUTH_SESSION_STRATEGY: "database" | "jwt" = "jwt"

// const getSession = async (sessionToken: string) => {
//  debug("Getting session", { sessionToken })
//  return db.session.findFirst({
//    where: {
//      sessionToken,
//      expires: {
//        gte: new Date(),
//      },
//    },
//    select: {
//      userId: true,
//    },
//  })
// }

export async function getUserId(c: Context) {
  try {
    const cookieName
      = process.env.NODE_ENV !== "production"
        ? "authjs.session-token"
        : "__Secure-authjs.session-token"
    const cookieValue = getCookie(c, cookieName)!

    debug("Parsing cookies", { cookieName, cookieValue })

    if (AUTH_SESSION_STRATEGY === "jwt") {
      const decodedJwt = await verifyJwt(cookieValue)
      debug("Parsing userId (jwt)", { id: decodedJwt?.sub })
      return decodedJwt?.sub
    // } else if (AUTH_SESSION_STRATEGY === "database") {
    //  const session = await getSession(cookieValue)
    //  debug("Parsing userId (db)", { id: session?.userId })
    //  return session?.userId
    }
  } catch (error) {
    console.error(error)
    throw new HTTPException(401, { message: "Unauthorized" })
  }
}
