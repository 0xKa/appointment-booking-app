import { PrismaClient } from "@/lib/generated/prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

function createPrisma() {
  const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter })
}

const g = globalThis as { prisma?: PrismaClient }
export const prisma = g.prisma ?? createPrisma()
if (process.env.NODE_ENV !== "production") g.prisma = prisma
