import { LoginForm } from "@/modules/auth/components/LoginForm"
import { redirect } from "next/navigation"
import { auth } from "@/shared/lib/auth"

export default async function LoginPage() {
  const session = await auth()
  if (session) redirect("/dashboard")

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <LoginForm />
    </div>
  )
}