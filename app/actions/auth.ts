"use server"

import { redirect } from "next/navigation"
import { Prisma } from "@/lib/generated/prisma/client"
import { createSession, deleteSession } from "@/lib/session"
import { createUser, findUserByEmail, verifyPassword } from "@/lib/users"
import { validateEmail, validateName, validatePassword } from "@/lib/auth-validation"

type FieldErrors = Partial<Record<"name" | "email" | "password" | "general", string>>

export type AuthFormState = { errors: FieldErrors } | undefined

function getField(formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === "string" ? value : ""
}

export async function signup(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const name = getField(formData, "name").trim()
  const email = getField(formData, "email").trim().toLowerCase()
  const password = getField(formData, "password")

  const errors: FieldErrors = {}
  const nameCheck = validateName(name)
  const emailCheck = validateEmail(email)
  const passwordCheck = validatePassword(password)
  if (!nameCheck.valid) errors.name = nameCheck.error
  if (!emailCheck.valid) errors.email = emailCheck.error
  if (!passwordCheck.valid) errors.password = passwordCheck.error
  if (Object.keys(errors).length > 0) return { errors }

  let user
  try {
    user = await createUser({ name, email, password })
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { errors: { email: "An account with this email already exists" } }
    }
    return { errors: { general: "Something went wrong. Please try again." } }
  }

  await createSession({ userId: user.id, email: user.email, name: user.name })
  redirect("/shops")
}

export async function login(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = getField(formData, "email").trim().toLowerCase()
  const password = getField(formData, "password")

  if (!email || !password) {
    return { errors: { general: "Email and password are required" } }
  }

  const user = await findUserByEmail(email)
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { errors: { general: "Invalid email or password" } }
  }

  await createSession({ userId: user.id, email: user.email, name: user.name })
  redirect("/shops")
}

export async function logout(): Promise<void> {
  await deleteSession()
  redirect("/login")
}
