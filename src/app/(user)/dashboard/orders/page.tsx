"use client"
import { useState } from "react"
import { useFetch } from "@/shared/hooks/useFetch"
import { usePagination } from "@/shared/hooks/usePagination"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Tabs } from "@/shared/ui/Tabs"
import { Pagination } from "@/shared/ui/Pagination"
import { EmptyState } from "@/shared/ui/EmptyState"
import { Badge } from "@/shared/ui/Badge"
import { Icon } from "@/shared/ui/Icon"
import { StaggerReveal, StaggerItem } from "@/shared/ui/StaggerReveal"
import { ShimmerSkeleton } from "@/shared/ui/ShimmerSkeleton"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { formatDateTime, relativeTime } from "@/shared/lib/utils"

const statusMap: Record<string, { label: string; variant: "warning" | "info" | "success" | "danger" | "default" }> = {
  pending_payment: { label: "待支付", variant: "warning" },
  confirmed: { label: "已确认", variant: "info" },
  processing: { label: "处理中", variant: "info" },
  completed: { label: "已完成", variant: "success" },
  cancelled: { label: "已取消", variant: "danger" },
}

export default function OrdersPage() {
  const { page, goToPage } = usePagination(1, 10)
  const [status, setStatus] = useState("")
  const params = new URLSearchParams({ page: String(page), ...(status && { status }) })
  const { data, isLoading } = useFetch<any>(`/api/orders?${params}`)

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">我的订单</h1>
      <Tabs
        tabs={[
          { key: "", label: "全部" },
          { key: "pending_payment", label: "待支付" },
          { key: "confirmed", label: "已确认" },
          { key: "processing", label: "处理中" },
          { key: "completed", label: "已完成" },
          { key: "cancelled", label: "已取消" },
        ]}
        activeTab={status}
        onTabChange={setStatus}
      />
      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <ShimmerSkeleton key={i} variant="card" className="h-20" />)}</div>
      ) : !data?.items?.length ? (
        <EmptyState icon={ShoppingCart} title="暂无订单" description="提交定制化需求或购买订阅" />
      ) : (
        <>
          <StaggerReveal className="space-y-3">
            {data.items.map((order: any) => (
              <StaggerItem key={order.id}>
                <Link href={`/dashboard/orders/${order.id}`}>
                  <GlassCard level={2} hover className="p-5 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">订单 #{order.id.slice(-8)}</p>
                      <p className="text-sm text-muted-foreground mt-1">{relativeTime(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-foreground font-semibold">¥{order.amount}</span>
                      <Badge variant={statusMap[order.status]?.variant || "default"}>
                        {statusMap[order.status]?.label || order.status}
                      </Badge>
                    </div>
                  </GlassCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerReveal>
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={goToPage} />
        </>
      )}
    </div>
  )
}
