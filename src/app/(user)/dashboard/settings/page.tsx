"use client"
import { useState } from "react"
import { useAuth } from "@/shared/hooks/useAuth"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Button } from "@/shared/ui/Button"
import { Input } from "@/shared/ui/Input"
import { Textarea } from "@/shared/ui/Textarea"
import { Icon } from "@/shared/ui/Icon"
import { useToast } from "@/shared/ui/Toast"
import { Save, Lock } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [bio, setBio] = useState(user?.bio || "")
  const [isSaving, setIsSaving] = useState(false)
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })
  const [isChangingPwd, setIsChangingPwd] = useState(false)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
      })
      if (!res.ok) throw new Error()
      addToast("success", "个人资料已更新")
    } catch { addToast("error", "更新失败") }
    finally { setIsSaving(false) }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) { addToast("warning", "两次密码不一致"); return }
    setIsChangingPwd(true)
    try {
      const res = await fetch("/api/users/me/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error?.message || "修改失败")
      addToast("success", "密码已修改")
      setPasswords({ current: "", new: "", confirm: "" })
    } catch (err: any) { addToast("error", err.message) }
    finally { setIsChangingPwd(false) }
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-foreground">个人设置</h1>

      <GlassCard level={2} className="p-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">个人资料</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input label="用户名" value={user?.username || ""} disabled />
          <Input label="邮箱" value={user?.email || ""} disabled />
          <Textarea label="简介" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="介绍一下你自己" />
          <Button type="submit" disabled={isSaving}><Icon icon={Save} size={16} />{isSaving ? "保存中..." : "保存"}</Button>
        </form>
      </GlassCard>

      <GlassCard level={2} className="p-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">修改密码</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input label="当前密码" type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} required />
          <Input label="新密码" type="password" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} hint="至少8位，需包含字母和数字" required />
          <Input label="确认新密码" type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} required />
          <Button type="submit" variant="secondary" disabled={isChangingPwd}><Icon icon={Lock} size={16} />{isChangingPwd ? "修改中..." : "修改密码"}</Button>
        </form>
      </GlassCard>
    </div>
  )
}
