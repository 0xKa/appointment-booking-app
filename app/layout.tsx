import type { Metadata } from "next"
import { Figtree, Roboto_Slab } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/nav/navbar"
import { Toaster } from "@/components/ui/sonner"

const robotoSlabHeading = Roboto_Slab({ subsets: ["latin"], variable: "--font-heading" })

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Booking App",
  description: "Book appointments with service providers at your favorite shops",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", figtree.variable, robotoSlabHeading.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
