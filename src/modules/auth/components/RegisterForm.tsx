"use client"
import { useState, useCallback, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/shared/ui/Input"
import { Button } from "@/shared/ui/Button"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Icon } from "@/shared/ui/Icon"
import { UserPlus } from "lucide-react"
import { useDebounce } from "@/shared/hooks/useDebounce"
import Link from "next/link"
import { MagneticButton } from "@/shared/ui/MagneticButton"

export function RegisterForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [globalError, setGlobalError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  const debouncedUsername = useDebounce(form.username, 500)

  const checkUsername = useCallback(async (username: string) => {
    if (username.length < 3 || !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(username)) {
      setUsernameAvailable(null)
      return
    }
    try {
      const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`)
      const json = await res.json()
      setUsernameAvailable(json.data.available)
    } catch {
      setUsernameAvailable(null)
    }
  }, [])

  // Check username availability on debounce
  useEffect(() => {
    if (debouncedUsername) {
      checkUsername(debouncedUsername)
    }
  }, [debouncedUsername, checkUsername])

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!form.username || form.username.length < 3 || form.username.length > 30) {
      errs.username = "用户名需要3-30个字符"
    }
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(form.username)) {
      errs.username = "用户名需以字母开头，仅含字母数字下划线"
    }
    if (usernameAvailable === false) {
      errs.username = "用户名已被注册"
    }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "请输入有效的邮箱地址"
    }
    if (!form.password || form.password.length < 8) {
      errs.password = "密码至少8位"
    }
    if (form.password && !/(?=.*[a-zA-Z])(?=.*\d)/.test(form.password)) {
      errs.password = "密码需包含字母和数字"
    }
    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = "两次密码输入不一致"
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError("")
    if (!validate()) return

    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      })
      const json = await res.json()

      if (!res.ok) {
        if (json.error?.details) {
          setErrors(json.error.details)
        } else {
          setGlobalError(json.error?.message || "注册失败")
        }
        return
      }

      // Auto sign in after registration
      const result = await signIn("credentials", {
        username: form.username,
        password: form.password,
        redirect: false,
      })

      if (result?.ok) {
        router.push("/dashboard")
        router.refresh()
      } else {
        router.push("/login")
      }
    } catch {
      setGlobalError("注册失败，请检查网络连接")
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  return (
    <GlassCard level={2} className="p-8 max-w-md mx-auto">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
          <Icon icon={UserPlus} size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">注册 DataLens</h1>
        <p className="text-sm text-muted-foreground mt-1">创建你的账号</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {globalError && (
          <div className="p-3 rounded-2xl bg-danger/10 border border-danger/20 text-sm text-danger">
            {globalError}
          </div>
        )}
        <Input
          label="用户名"
          value={form.username}
          onChange={(e) => updateField("username", e.target.value)}
          error={errors.username}
          hint={usernameAvailable === true && !errors.username ? "用户名可用" : undefined}
          placeholder="3-30位，字母开头"
          required
        />
        <Input
          label="邮箱"
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          error={errors.email}
          placeholder="your@email.com"
          required
        />
        <Input
          label="密码"
          type="password"
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
          error={errors.password}
          hint="至少8位，需包含字母和数字"
          placeholder="输入密码"
          required
        />
        <Input
          label="确认密码"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => updateField("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
          placeholder="再次输入密码"
          required
        />
        <MagneticButton maxOffset={8}>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "注册中..." : "注册"}
          </Button>
        </MagneticButton>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        已有账号？{" "}
        <Link href="/login" className="text-primary hover:underline">
          去登录
        </Link>
      </p>
    </GlassCard>
  )
}