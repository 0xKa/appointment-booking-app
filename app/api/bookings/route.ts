import { NextResponse, type NextRequest } from "next/server"
import { createBooking, getBookingsForProvider } from "@/lib/bookings"
import { validateBookingRequest } from "@/lib/booking-validation"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  const shopId = request.nextUrl.searchParams.get("shopId")
  const providerId = request.nextUrl.searchParams.get("providerId")

  if (!shopId || !providerId) {
    return NextResponse.json(
      { error: "shopId and providerId query params are required" },
      { status: 400 },
    )
  }

  const bookings = await getBookingsForProvider(shopId, providerId)
  return NextResponse.json(bookings)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const validation = validateBookingRequest(body)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const outcome = await createBooking({ ...validation.data, userId: session.userId })
  if (!outcome.ok) {
    return NextResponse.json({ error: "Slot already booked" }, { status: 409 })
  }

  return NextResponse.json(
    { id: outcome.booking.id, ...validation.data },
    { status: 201 },
  )
}
