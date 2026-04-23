"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { generateSlots } from "@/lib/shops"
import { cn } from "@/lib/utils"

interface SlotPickerProps {
  shopId: string
  providerId: string
  initialBookedTimes: string[]
}

export function SlotPicker({ shopId, providerId, initialBookedTimes }: SlotPickerProps) {
  const [bookedTimes, setBookedTimes] = useState<string[]>(initialBookedTimes)
  const [pendingTime, setPendingTime] = useState<string | null>(null)
  const router = useRouter()

  async function refreshBookings() {
    const res = await fetch(
      `/api/bookings?shopId=${shopId}&providerId=${providerId}`,
      { cache: "no-store" },
    )
    if (res.ok) {
      const data: { time: string }[] = await res.json()
      setBookedTimes(data.map((b) => b.time))
    }
  }

  async function bookSlot(time: string) {
    setPendingTime(time)
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId, providerId, time }),
      })

      if (res.status === 201) {
        toast.success(`Booked ${time}`)
        await refreshBookings()
      } else if (res.status === 409) {
        toast.error("That slot was just taken. Try another one.")
        await refreshBookings()
      } else if (res.status === 401) {
        toast.error("Please log in to book")
        router.push("/login")
      } else {
        toast.error("Something went wrong. Try again.")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setPendingTime(null)
    }
  }

  const slots = generateSlots()
  const bookedSet = new Set(bookedTimes)

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
      {slots.map((time) => {
        const isBooked = bookedSet.has(time)
        const isPending = pendingTime === time
        return (
          <Button
            key={time}
            variant={isBooked ? "secondary" : "outline"}
            disabled={isBooked || isPending}
            onClick={() => bookSlot(time)}
            className={cn(isBooked && "opacity-50 line-through cursor-not-allowed")}
            aria-label={isBooked ? `${time} (booked)` : `Book ${time}`}
          >
            {isPending ? "…" : time}
          </Button>
        )
      })}
    </div>
  )
}
