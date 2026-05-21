"use client"
import { use } from "react"
import { useFetch } from "@/shared/hooks/useFetch"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Badge } from "@/shared/ui/Badge"
import { Button } from "@/shared/ui/Button"
import { Icon } from "@/shared/ui/Icon"
import { ErrorState } from "@/shared/ui/ErrorState"
import { ShimmerSkeleton } from "@/shared/ui/ShimmerSkeleton"
import { ArrowLeft, Clock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { formatDateTime, relativeTime } from "@/shared/lib/utils"
import { MagneticButton } from "@/shared/ui/MagneticButton"

const statusSteps = ["pending_payment", "confirmed", "processing", "completed"]
const statusLabel: Record<string, string> = { pending_payment: "待支付", confirmed: "已确认", processing: "处理中", completed: "已完成", cancelled: "已取消" }

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: order, error, isLoading, refetch } = useFetch<any>(`/api/orders/${id}`)

  if (isLoading) return <div className="p-6 lg:p-8"><ShimmerSkeleton variant="card" className="h-64" /></div>
  if (error) return <div className="p-6 lg:p-8"><ErrorState onRetry={refetch} /></div>
  if (!order) return null

  const currentStep = statusSteps.indexOf(order.status)

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <Link href="/dashboard/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <Icon icon={ArrowLeft} size={16} />返回订单列表
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">订单 #{id.slice(-8)}</h1>
        <Badge variant={order.status === "completed" ? "success" : order.status === "cancelled" ? "danger" : "info"}>
          {statusLabel[order.status] || order.status}
        </Badge>
      </div>
      <GlassCard level={2} className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between"><span className="text-muted-foreground">金额</span><span className="font-semibold text-foreground">¥{order.amount}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">创建时间</span><span className="text-foreground">{formatDateTime(order.createdAt)}</span></div>
          {order.requirement && (
            <div><span className="text-muted-foreground">需求详情</span>
              <p className="text-foreground mt-1">{typeof order.requirement === "string" ? order.requirement : JSON.stringify(order.requirement)}</p>
            </div>
          )}
          {order.adminNote && <div><span className="text-muted-foreground">管理员备注</span><p className="text-foreground mt-1">{order.adminNote}</p></div>}
          {order.deliverUrl && <div><span className="text-muted-foreground">交付文件</span><a href={order.deliverUrl} className="text-primary hover:underline mt-1 block">下载交付文件</a></div>}
        </div>
      </GlassCard>

      {/* Status Timeline */}
      {order.status !== "cancelled" && (
        <GlassCard level={2} className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">订单进度</h2>
          <div className="flex items-center justify-between">
            {statusSteps.map((step, i) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i <= currentStep ? "bg-primary text-primary-foreground" : "bg-white/[0.05] text-muted-foreground"}`}>
                  {i <= currentStep ? <Icon icon={CheckCircle} size={20} /> : <Icon icon={Clock} size={20} />}
                </div>
                <p className="text-xs mt-2 text-muted-foreground">{statusLabel[step]}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {order.status === "pending_payment" && (
        <div className="flex gap-3">
          <MagneticButton href={`/dashboard/orders/${id}/pay`} maxOffset={8}>
            <Button>去支付</Button>
          </MagneticButton>
        </div>
      )}
    </div>
  )
}
