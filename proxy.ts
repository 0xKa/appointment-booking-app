import { NextResponse, type NextRequest } from "next/server"
import { decrypt, SESSION_COOKIE } from "@/lib/jwt"

const PROTECTED_PREFIX = "/shops"
const AUTH_PAGES = ["/login", "/signup"]

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get(SESSION_COOKIE)?.value
  const session = await decrypt(token)

  if (path.startsWith(PROTECTED_PREFIX) && !session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (AUTH_PAGES.includes(path) && session) {
    return NextResponse.redirect(new URL("/shops", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
