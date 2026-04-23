import { AuthFormShell } from "@/components/auth/auth-form-shell"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <AuthFormShell
        title="Create an account"
        description="Get started booking appointments"
        footer={{ prompt: "Already have an account?", linkText: "Sign in", href: "/login" }}
      >
        <SignupForm />
      </AuthFormShell>
    </main>
  )
}
