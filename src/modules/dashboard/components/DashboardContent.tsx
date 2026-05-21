"use client"
import { useFetch } from "@/shared/hooks/useFetch"
import { GlassCard } from "@/shared/ui/GlassCard"
import { TiltCard } from "@/shared/ui/TiltCard"
import { AnimatedCounter } from "@/shared/ui/AnimatedCounter"
import { MagneticButton } from "@/shared/ui/MagneticButton"
import { Icon } from "@/shared/ui/Icon"
import { ShimmerSkeleton } from "@/shared/ui/ShimmerSkeleton"
import { FileText, BarChart3, ShoppingCart, Sparkles } from "lucide-react"

export function KpiCards() {
  const { data, isLoading } = useFetch<{
    reportsCount: number
    chartsCount: number
    ordersCount: number
    remainingCustom: number
  }>("/api/dashboard/stats")

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <ShimmerSkeleton key={i} variant="card" className="h-32" />
        ))}
      </div>
    )
  }

  const kpis = [
    { label: "我的报告", value: data?.reportsCount || 0, icon: FileText, color: "text-primary" },
    { label: "我的图表", value: data?.chartsCount || 0, icon: BarChart3, color: "text-accent" },
    { label: "我的订单", value: data?.ordersCount || 0, icon: ShoppingCart, color: "text-info" },
    { label: "剩余定制次数", value: data?.remainingCustom || 0, icon: Sparkles, color: "text-success" },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <TiltCard key={kpi.label}>
          <GlassCard level={2} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Icon icon={kpi.icon} size={20} className={kpi.color} />
            </div>
            <p className="text-3xl font-black text-foreground">
              <AnimatedCounter value={kpi.value} />
            </p>
            <p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
          </GlassCard>
        </TiltCard>
      ))}
    </div>
  )
}

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <MagneticButton href="/dashboard/reports/upload" maxOffset={5}>
        <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-2xl font-medium">
          <Icon icon={FileText} size={16} />
          上传报告
        </span>
      </MagneticButton>
      <MagneticButton href="/dashboard/charts/upload" maxOffset={5}>
        <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.08] text-foreground rounded-2xl font-medium border border-white/[0.06]">
          <Icon icon={BarChart3} size={16} />
          上传图表
        </span>
      </MagneticButton>
      <MagneticButton href="/dashboard/charts/generate" maxOffset={5}>
        <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.08] text-foreground rounded-2xl font-medium border border-white/[0.06]">
          <Icon icon={Sparkles} size={16} />
          生成图表
        </span>
      </MagneticButton>
      <MagneticButton href="/dashboard/orders/custom/new" maxOffset={5}>
        <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-2xl font-medium">
          <Icon icon={ShoppingCart} size={16} />
          提交定制需求
        </span>
      </MagneticButton>
    </div>
  )
}