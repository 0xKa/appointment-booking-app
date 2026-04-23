import { AuthFormShell } from "@/components/auth/auth-form-shell"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <AuthFormShell
        title="Welcome back"
        description="Sign in to book your next appointment"
        footer={{ prompt: "Don't have an account?", linkText: "Sign up", href: "/signup" }}
      >
        <LoginForm />
      </AuthFormShell>
    </main>
  )
}
