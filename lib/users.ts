import "server-only"
import { prisma } from "./db"

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password)
  const hash = await crypto.subtle.digest("SHA-256", data)
  return Buffer.from(hash).toString("hex")
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return (await hashPassword(password)) === storedHash
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } })
}

export async function createUser(data: { email: string; name: string; password: string }) {
  const passwordHash = await hashPassword(data.password)
  return prisma.user.create({
    data: { email: data.email, name: data.name, passwordHash },
  })
}
