import Link from "next/link"
import { notFound } from "next/navigation"
import { getShopById } from "@/lib/shops"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type PageProps = { params: Promise<{ shopId: string }> }

export default async function ShopPage({ params }: PageProps) {
  const { shopId } = await params
  const shop = getShopById(shopId)
  if (!shop) notFound()

  return (
    <main className="container max-w-5xl mx-auto p-6">
      <Link
        href="/shops"
        className="text-sm text-muted-foreground hover:text-foreground underline"
      >
        ← Back to shops
      </Link>
      <h1 className="text-3xl font-bold mt-4 mb-2">{shop.name}</h1>
      <p className="text-muted-foreground mb-8">Pick a service provider</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shop.providers.map((provider) => (
          <Link
            key={provider.id}
            href={`/shops/${shop.id}/${provider.id}`}
            className="group"
          >
            <Card className="h-full transition-colors group-hover:border-foreground">
              <CardHeader>
                <CardTitle>{provider.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Available 09:00 – 22:00</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}
