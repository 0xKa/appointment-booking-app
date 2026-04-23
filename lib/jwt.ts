import { SignJWT, jwtVerify } from "jose"
import type { SessionPayload } from "./types"

export const SESSION_COOKIE = "session"
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

const JWT_ALGORITHM = "HS256"
const JWT_EXPIRATION = "7d"

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error("SESSION_SECRET env var is required")
  return new TextEncoder().encode(secret)
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(getSecret())
}

export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: [JWT_ALGORITHM] })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}
