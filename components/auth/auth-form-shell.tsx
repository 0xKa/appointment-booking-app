import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthFormShellProps {
  title: string
  description: string
  footer: { prompt: string; linkText: string; href: string }
  children: React.ReactNode
}

export function AuthFormShell({ title, description, footer, children }: AuthFormShellProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
        <p className="text-sm text-muted-foreground text-center">
          {footer.prompt}{" "}
          <Link href={footer.href} className="underline hover:text-foreground">
            {footer.linkText}
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
