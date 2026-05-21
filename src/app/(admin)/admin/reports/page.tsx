"use client"
import { useState } from "react"
import { useFetch } from "@/shared/hooks/useFetch"
import { usePagination } from "@/shared/hooks/usePagination"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Input } from "@/shared/ui/Input"
import { Pagination } from "@/shared/ui/Pagination"
import { Badge } from "@/shared/ui/Badge"
import { Button } from "@/shared/ui/Button"
import { useToast } from "@/shared/ui/Toast"
import { formatDateTime } from "@/shared/lib/utils"

export default function AdminReportsPage() {
  const { page, goToPage } = usePagination()
  const [search, setSearch] = useState("")
  const { addToast } = useToast()
  const params = new URLSearchParams({ page: String(page), search })
  const { data, refetch } = useFetch<any>(`/api/admin/reports?${params}`)

  const toggleActive = async (id: string, isActive: boolean) => {
    const res = await fetch(`/api/admin/reports/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    })
    if (res.ok) { addToast("success", isActive ? "已下架" : "已恢复"); refetch() }
    else addToast("error", "操作失败")
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">报告管理</h1>
      <Input placeholder="搜索报告..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
      <GlassCard level={2} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/[0.06]">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">标题</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">作者</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">创建时间</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">操作</th>
            </tr></thead>
            <tbody>
              {data?.items?.map((r: any) => (
                <tr key={r.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-foreground">{r.title}</td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">{r.user?.username}</td>
                  <td className="px-4 py-3"><Badge>{r.type === "finished" ? "成品" : "源数据"}</Badge></td>
                  <td className="px-4 py-3"><Badge variant={r.isActive ? "success" : "danger"}>{r.isActive ? "正常" : "已下架"}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">{formatDateTime(r.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" onClick={() => toggleActive(r.id, r.isActive)}>
                      {r.isActive ? "下架" : "恢复"}
                    </Button>
                  </td>
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
