"use client"
import { useFetch } from "@/shared/hooks/useFetch"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Badge } from "@/shared/ui/Badge"
import { Button } from "@/shared/ui/Button"
import { AnimatedCounter } from "@/shared/ui/AnimatedCounter"
import { Icon } from "@/shared/ui/Icon"
import { ShimmerSkeleton } from "@/shared/ui/ShimmerSkeleton"
import { CreditCard, Check } from "lucide-react"
import Link from "next/link"
import { formatDateTime } from "@/shared/lib/utils"
import { MagneticButton } from "@/shared/ui/MagneticButton"

export default function SubscriptionPage() {
  const { data: subs, isLoading } = useFetch<any[]>("/api/subscriptions")
  const { data: plans } = useFetch<any[]>("/api/subscriptions/plans")

  if (isLoading) return <div className="p-6 lg:p-8"><ShimmerSkeleton variant="card" className="h-48" /></div>

  const activeSub = subs?.find((s: any) => s.status === "active")

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <h1 className="text-2xl font-bold text-foreground">我的订阅</h1>

      {activeSub ? (
        <GlassCard level={2} className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">{activeSub.plan?.name || "订阅方案"}</h2>
            <Badge variant="success">生效中</Badge>
          </div>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div><p className="text-sm text-muted-foreground">到期时间</p><p className="text-foreground font-medium">{activeSub.endDate ? formatDateTime(activeSub.endDate) : "—"}</p></div>
            <div><p className="text-sm text-muted-foreground">剩余定制次数</p><p className="text-3xl font-black text-foreground"><AnimatedCounter value={activeSub.customReportRemaining} /></p></div>
            <div><p className="text-sm text-muted-foreground">开始时间</p><p className="text-foreground font-medium">{activeSub.startDate ? formatDateTime(activeSub.startDate) : "—"}</p></div>
          </div>
          <div className="flex gap-3">
            <Link href="/pricing"><Button variant="secondary">续费/升级</Button></Link>
          </div>
        </GlassCard>
      ) : (
        <GlassCard level={2} className="p-8 text-center">
          <Icon icon={CreditCard} size={40} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">暂无活跃订阅</p>
          <p className="text-sm text-muted-foreground mb-6">订阅解锁无限下载和定制分析次数</p>
          <Link href="/pricing"><Button>查看方案</Button></Link>
        </GlassCard>
      )}

      {/* Plan cards */}
      {plans && plans.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">可选方案</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan: any) => (
              <GlassCard key={plan.id} level={2} className="p-6">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="text-3xl font-black text-foreground mt-2">¥{plan.price}<span className="text-sm text-muted-foreground font-normal">/{plan.type === "monthly" ? "月" : plan.type === "yearly" ? "年" : "次"}</span></p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground"><Icon icon={Check} size={14} className="text-success" />无限下载</li>
                  {plan.customReportCount > 0 && <li className="flex items-center gap-2 text-sm text-muted-foreground"><Icon icon={Check} size={14} className="text-success" />{plan.customReportCount}次定制分析</li>}
                </ul>
                <MagneticButton href="/pricing" maxOffset={8} className="w-full mt-4">
                <Button variant="secondary" className="w-full">选择</Button>
              </MagneticButton>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
