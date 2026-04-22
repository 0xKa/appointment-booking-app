import "server-only"
import { prisma } from "./db"
import { Prisma } from "@/lib/generated/prisma/client"

export async function getBookingsForProvider(shopId: string, providerId: string) {
  return prisma.booking.findMany({
    where: { shopId, providerId },
    select: { time: true },
  })
}

export async function createBooking(data: {
  shopId: string
  providerId: string
  time: string
  userId: string
}): Promise<{ ok: true; booking: { id: string } } | { ok: false; conflict: true }> {
  try {
    const booking = await prisma.booking.create({ data })
    return { ok: true, booking }
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, conflict: true }
    }
    throw e
  }
}
