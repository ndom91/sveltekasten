import { hkdf } from "@panva/hkdf"
import { jwtDecrypt } from "jose"

export interface DefaultJWT extends Record<string, unknown> {
  name?: string | null
  email?: string | null
  picture?: string | null
  sub?: string
  iat?: number
  exp?: number
  jti?: string
}

interface JWT extends Record<string, unknown>, DefaultJWT {}

interface JWTDecodeParams {
  salt: string
  secret: string
  token?: string
}

async function getDerivedEncryptionKey(
  keyMaterial: Parameters<typeof hkdf>[1],
  salt: Parameters<typeof hkdf>[2]
) {
  return await hkdf(
    "sha256",
    keyMaterial,
    salt,
    `Auth.js Generated Encryption Key (${salt as string})`,
    64
  )
}

export async function decode<Payload = JWT>(params: JWTDecodeParams): Promise<Payload | null> {
  const { token, secret, salt } = params
  if (!token) {
    return null
  }

  const encryptionSecret = await getDerivedEncryptionKey(secret, salt)
  const { payload } = await jwtDecrypt(token, encryptionSecret, {
    clockTolerance: 15,
  })
  return payload as Payload
}

export async function verifyJwt(token: string) {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET not set")
  }

  const salt =
    process.env.NODE_ENV !== "production" ? "authjs.session-token" : "__Secure-authjs.session-token"

  try {
    return await decode({
      token,
      secret,
      salt,
    })
  } catch (e) {
    console.error(e)
    throw new Error("Invalid token")
  }
}
