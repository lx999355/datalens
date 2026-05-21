"use client"
import { useState } from "react"
import { useFetch } from "@/shared/hooks/useFetch"
import { GlassCard } from "@/shared/ui/GlassCard"
import { TiltCard } from "@/shared/ui/TiltCard"
import { AnimatedCounter } from "@/shared/ui/AnimatedCounter"
import { Tabs } from "@/shared/ui/Tabs"
import { Icon } from "@/shared/ui/Icon"
import { ShimmerSkeleton } from "@/shared/ui/ShimmerSkeleton"
import { Users, ShoppingCart, DollarSign, FileText, BarChart3, CreditCard } from "lucide-react"

export default function AdminDashboard() {
  const [range, setRange] = useState("today")
  const { data, isLoading } = useFetch<any>(`/api/admin/stats?range=${range}`)

  const kpis = [
    { label: "用户总数", value: data?.usersCount || 0, icon: Users, color: "text-primary" },
    { label: "新增用户", value: data?.newUsersCount || 0, icon: Users, color: "text-accent" },
    { label: "待处理订单", value: data?.pendingOrders || 0, icon: ShoppingCart, color: "text-warning" },
    { label: "收入", value: data?.todayRevenue || 0, icon: DollarSign, color: "text-success", prefix: "¥" },
    { label: "报告总数", value: data?.reportsCount || 0, icon: FileText, color: "text-info" },
    { label: "图表总数", value: data?.chartsCount || 0, icon: BarChart3, color: "text-primary" },
    { label: "活跃订阅", value: data?.activeSubscriptions || 0, icon: CreditCard, color: "text-accent" },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">管理仪表盘</h1>
        <Tabs
          tabs={[{ key: "today", label: "今日" }, { key: "week", label: "本周" }, { key: "month", label: "本月" }]}
          activeTab={range}
          onTabChange={setRange}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(7)].map((_, i) => <ShimmerSkeleton key={i} variant="card" className="h-28" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <TiltCard key={kpi.label}>
              <GlassCard level={2} className="p-5">
                <Icon icon={kpi.icon} size={20} className={kpi.color} />
                <p className="text-2xl font-black text-foreground mt-2">
                  {kpi.prefix || ""}<AnimatedCounter value={kpi.value} />
                </p>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
              </GlassCard>
            </TiltCard>
          ))}
        </div>
      )}
    </div>
  )
}
