import Link from "next/link"
import { getSession } from "@/lib/session"
import { ModeToggle } from "@/components/mode-toggle"
import { LogoutButton } from "./logout-button"

export async function Navbar() {
  const session = await getSession()
  return (
    <header className="border-b">
      <div className="container max-w-5xl mx-auto flex items-center justify-between p-4">
        <Link href={session ? "/shops" : "/"} className="font-bold text-lg">
          Booking App
        </Link>
        <div className="flex items-center gap-3">
          {session && (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Hi, {session.name}
              </span>
              <LogoutButton />
            </>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
