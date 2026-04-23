import "server-only"
import { cookies } from "next/headers"
import { encrypt, decrypt, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "./jwt"
import type { SessionPayload } from "./types"

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV === "production",
  maxAge: SESSION_MAX_AGE_SECONDS,
} as const

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await encrypt(payload)
  const store = await cookies()
  store.set(SESSION_COOKIE, token, COOKIE_OPTIONS)
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies()
  return decrypt(store.get(SESSION_COOKIE)?.value)
}

export async function deleteSession(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}
