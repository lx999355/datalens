"use client"
import { useState } from "react"
import { useFetch } from "@/shared/hooks/useFetch"
import { usePagination } from "@/shared/hooks/usePagination"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Input } from "@/shared/ui/Input"
import { Tabs } from "@/shared/ui/Tabs"
import { Pagination } from "@/shared/ui/Pagination"
import { Badge } from "@/shared/ui/Badge"
import { Button } from "@/shared/ui/Button"
import { Icon } from "@/shared/ui/Icon"
import { Avatar } from "@/shared/ui/Avatar"
import { useToast } from "@/shared/ui/Toast"
import { Search } from "lucide-react"
import { formatDateTime } from "@/shared/lib/utils"

const roleLabels: Record<string, { label: string; variant: "info" | "warning" | "default" }> = {
  super_admin: { label: "超管", variant: "warning" },
  sub_admin: { label: "管理员", variant: "info" },
  user: { label: "用户", variant: "default" },
}

export default function AdminUsersPage() {
  const { page, goToPage } = usePagination()
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("")
  const { addToast } = useToast()
  const params = new URLSearchParams({ page: String(page), search, role })
  const { data, refetch } = useFetch<any>(`/api/admin/users?${params}`)

  const toggleActive = async (id: string, isActive: boolean) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    })
    if (res.ok) { addToast("success", "状态已更新"); refetch() }
    else addToast("error", "操作失败")
  }

  const setRole_ = async (id: string, newRole: string) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    })
    if (res.ok) { addToast("success", "角色已更新"); refetch() }
    else addToast("error", "操作失败")
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">用户管理</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <Input placeholder="搜索用户名/邮箱..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <Tabs tabs={[{ key: "", label: "全部" }, { key: "user", label: "用户" }, { key: "sub_admin", label: "管理员" }, { key: "super_admin", label: "超管" }]}
          activeTab={role} onTabChange={setRole} />
      </div>
      <GlassCard level={2} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/[0.06]">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">用户</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">邮箱</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">角色</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">注册时间</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">操作</th>
            </tr></thead>
            <tbody>
              {data?.items?.map((u: any) => (
                <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><Avatar src={u.avatar} size="sm" /><span className="text-foreground">{u.username}</span></div></td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">{u.email}</td>
                  <td className="px-4 py-3"><Badge variant={roleLabels[u.role]?.variant || "default"}>{roleLabels[u.role]?.label || u.role}</Badge></td>
                  <td className="px-4 py-3"><Badge variant={u.isActive ? "success" : "danger"}>{u.isActive ? "正常" : "禁用"}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">{formatDateTime(u.createdAt)}</td>
                  <td className="px-4 py-3"><div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleActive(u.id, u.isActive)}>{u.isActive ? "禁用" : "启用"}</Button>
                    {u.role === "user" && <Button variant="ghost" size="sm" onClick={() => setRole_(u.id, "sub_admin")}>设为管理员</Button>}
                    {u.role === "sub_admin" && <Button variant="ghost" size="sm" onClick={() => setRole_(u.id, "user")}>降为用户</Button>}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
      {data && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={goToPage} />}
    </div>
  )
}
