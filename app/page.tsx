import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/session"

export default async function HomePage() {
  const session = await getSession()
  if (session) redirect("/shops")

  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold">Book your next appointment</h1>
        <p className="text-muted-foreground">
          Pick a shop, choose a service provider, and reserve a time slot in
          seconds.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/signup">Create account</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
