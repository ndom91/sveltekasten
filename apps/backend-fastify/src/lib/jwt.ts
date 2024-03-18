import { hkdf } from "@panva/hkdf"
import { jwtDecrypt } from "jose"

async function getDerivedEncryptionKey(keyMaterial: Parameters<typeof hkdf>[1], salt: Parameters<typeof hkdf>[2]) {
  return await hkdf("sha256", keyMaterial, salt, `Auth.js Generated Encryption Key (${salt})`, 64)
}
export async function decode<Payload = JWT>(params: JWTDecodeParams): Promise<Payload | null> {
  const { token, secret, salt } = params
  if (!token) return null
  const encryptionSecret = await getDerivedEncryptionKey(secret, salt)
  const { payload } = await jwtDecrypt(token, encryptionSecret, {
    clockTolerance: 15,
  })
  return payload as Payload
}

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

interface JWTEncodeParams<Payload = JWT> {
  maxAge?: number
  salt: string
  secret: string
  token?: Payload
}

interface JWTDecodeParams {
  salt: string
  secret: string
  token?: string
}
