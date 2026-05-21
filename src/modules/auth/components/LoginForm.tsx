"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/shared/ui/Input"
import { Button } from "@/shared/ui/Button"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Icon } from "@/shared/ui/Icon"
import { LogIn } from "lucide-react"
import Link from "next/link"
import { MagneticButton } from "@/shared/ui/MagneticButton"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError("登录失败，请检查网络连接")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GlassCard level={2} className="p-8 max-w-md mx-auto">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
          <Icon icon={LogIn} size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">登录 DataLens</h1>
        <p className="text-sm text-muted-foreground mt-1">欢迎回来</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-2xl bg-danger/10 border border-danger/20 text-sm text-danger">
            {error}
          </div>
        )}
        <Input
          label="用户名或邮箱"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="输入用户名或邮箱"
          required
        />
        <Input
          label="密码"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="输入密码"
          required
        />
        <MagneticButton maxOffset={8}>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "登录中..." : "登录"}
          </Button>
        </MagneticButton>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        没有账号？{" "}
        <Link href="/register" className="text-primary hover:underline">
          去注册
        </Link>
      </p>
    </GlassCard>
  )
}