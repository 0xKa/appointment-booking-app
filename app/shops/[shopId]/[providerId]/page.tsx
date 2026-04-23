import Link from "next/link"
import { notFound } from "next/navigation"
import { getProviderById, getShopById } from "@/lib/shops"
import { getBookingsForProvider } from "@/lib/bookings"
import { SlotPicker } from "@/components/booking/slot-picker"

type PageProps = { params: Promise<{ shopId: string; providerId: string }> }

export default async function ProviderPage({ params }: PageProps) {
  const { shopId, providerId } = await params
  const shop = getShopById(shopId)
  const provider = getProviderById(shopId, providerId)
  if (!shop || !provider) notFound()

  const bookings = await getBookingsForProvider(shopId, providerId)
  const initialBookedTimes = bookings.map((b) => b.time)

  return (
    <main className="container max-w-5xl mx-auto p-6">
      <Link
        href={`/shops/${shopId}`}
        className="text-sm text-muted-foreground hover:text-foreground underline"
      >
        ← Back to {shop.name}
      </Link>
      <h1 className="text-3xl font-bold mt-4 mb-1">{provider.name}</h1>
      <p className="text-muted-foreground mb-8">
        {shop.name} · Pick an available time slot
      </p>
      <SlotPicker
        shopId={shopId}
        providerId={providerId}
        initialBookedTimes={initialBookedTimes}
      />
    </main>
  )
}
