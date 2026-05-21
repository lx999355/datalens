"use client"
import { useState } from "react"
import { useFetch } from "@/shared/hooks/useFetch"
import { usePagination } from "@/shared/hooks/usePagination"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Tabs } from "@/shared/ui/Tabs"
import { Pagination } from "@/shared/ui/Pagination"
import { Badge } from "@/shared/ui/Badge"
import { Icon } from "@/shared/ui/Icon"
import { formatDateTime, relativeTime } from "@/shared/lib/utils"
import { Eye } from "lucide-react"
import Link from "next/link"

const statusMap: Record<string, { label: string; variant: "warning" | "info" | "success" | "danger" }> = {
  pending_payment: { label: "待支付", variant: "warning" },
  confirmed: { label: "已确认", variant: "info" },
  processing: { label: "处理中", variant: "info" },
  completed: { label: "已完成", variant: "success" },
  cancelled: { label: "已取消", variant: "danger" },
}

export default function AdminOrdersPage() {
  const { page, goToPage } = usePagination(1, 10)
  const [status, setStatus] = useState("")
  const params = new URLSearchParams({ page: String(page), ...(status && { status }) })
  const { data } = useFetch<any>(`/api/admin/orders?${params}`)

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">订单管理</h1>
      <Tabs
        tabs={[{ key: "", label: "全部" }, { key: "pending_payment", label: "待确认" }, { key: "confirmed", label: "已确认" }, { key: "processing", label: "处理中" }, { key: "completed", label: "已完成" }]}
        activeTab={status} onTabChange={setStatus}
      />
      <GlassCard level={2} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/[0.06]">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">订单号</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">用户</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">金额</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">时间</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">操作</th>
            </tr></thead>
            <tbody>
              {data?.items?.map((o: any) => (
                <tr key={o.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-foreground font-mono text-sm">#{o.id.slice(-8)}</td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">{o.user?.username}</td>
                  <td className="px-4 py-3"><Badge>{o.type === "custom" ? "定制" : o.type === "subscription" ? "订阅" : "单次"}</Badge></td>
                  <td className="px-4 py-3 text-foreground">¥{o.amount}</td>
                  <td className="px-4 py-3"><Badge variant={statusMap[o.status]?.variant || "default"}>{statusMap[o.status]?.label || o.status}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">{relativeTime(o.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="text-primary hover:underline text-sm flex items-center gap-1">
                      <Icon icon={Eye} size={14} />处理
                    </Link>
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
