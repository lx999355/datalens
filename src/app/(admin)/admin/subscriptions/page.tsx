"use client"
import { useFetch } from "@/shared/hooks/useFetch"
import { usePagination } from "@/shared/hooks/usePagination"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Pagination } from "@/shared/ui/Pagination"
import { Badge } from "@/shared/ui/Badge"
import { Button } from "@/shared/ui/Button"
import { useToast } from "@/shared/ui/Toast"
import { formatDateTime } from "@/shared/lib/utils"

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
  pending: { label: "待激活", variant: "warning" },
  active: { label: "生效中", variant: "success" },
  expired: { label: "已过期", variant: "danger" },
  cancelled: { label: "已取消", variant: "default" },
}

export default function AdminSubscriptionsPage() {
  const { page, goToPage } = usePagination()
  const { addToast } = useToast()
  const { data, refetch } = useFetch<any>(`/api/admin/subscriptions?page=${page}`)

  const activate = async (id: string, planId: string) => {
    try {
      const plan = await (await fetch("/api/subscriptions/plans")).json()
      const p = plan.data?.find((x: any) => x.id === planId)
      const now = new Date()
      const endDate = new Date(now)
      if (p?.type === "monthly") endDate.setDate(endDate.getDate() + 30)
      else if (p?.type === "yearly") endDate.setDate(endDate.getDate() + 365)

      const res = await fetch(`/api/admin/subscriptions/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active", startDate: now.toISOString(), endDate: endDate.toISOString(), customReportRemaining: p?.customReportCount || 0 }),
      })
      if (res.ok) { addToast("success", "已激活"); refetch() }
      else addToast("error", "激活失败")
    } catch { addToast("error", "操作失败") }
  }

  const cancel = async (id: string) => {
    const res = await fetch(`/api/admin/subscriptions/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    })
    if (res.ok) { addToast("success", "已取消"); refetch() }
    else addToast("error", "操作失败")
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">订阅管理</h1>
      <GlassCard level={2} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/[0.06]">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">用户</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">方案</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">剩余次数</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">到期时间</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">操作</th>
            </tr></thead>
            <tbody>
              {data?.items?.map((s: any) => (
                <tr key={s.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-foreground">{s.user?.username}</td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">{s.plan?.name}</td>
                  <td className="px-4 py-3"><Badge variant={statusMap[s.status]?.variant || "default"}>{statusMap[s.status]?.label || s.status}</Badge></td>
                  <td className="px-4 py-3 text-foreground">{s.customReportRemaining}</td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">{s.endDate ? formatDateTime(s.endDate) : "—"}</td>
                  <td className="px-4 py-3"><div className="flex gap-2">
                    {s.status === "pending" && <Button variant="ghost" size="sm" onClick={() => activate(s.id, s.planId)}>激活</Button>}
                    {s.status === "active" && <Button variant="ghost" size="sm" onClick={() => cancel(s.id)}>取消</Button>}
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
