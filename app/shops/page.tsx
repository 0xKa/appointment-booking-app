import Link from "next/link"
import { SHOPS } from "@/lib/shops"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ShopsPage() {
  return (
    <main className="container max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Choose a shop</h1>
      <p className="text-muted-foreground mb-8">Browse shops to book your next appointment</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SHOPS.map((shop) => (
          <Link key={shop.id} href={`/shops/${shop.id}`} className="group block h-full">
            <Card className="h-full flex flex-col transition-colors group-hover:border-foreground">
              <CardHeader>
                <CardTitle>{shop.name}</CardTitle>
                <CardDescription>{shop.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <p className="text-sm text-muted-foreground">
                  {shop.providers.length} service provider{shop.providers.length === 1 ? "" : "s"}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}
