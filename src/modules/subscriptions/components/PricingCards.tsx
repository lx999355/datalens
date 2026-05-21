"use client"
import { useFetch } from "@/shared/hooks/useFetch"
import { GlassCard } from "@/shared/ui/GlassCard"
import { AnimatedBorder } from "@/shared/ui/AnimatedBorder"
import { Button } from "@/shared/ui/Button"
import { Icon } from "@/shared/ui/Icon"
import { Check } from "lucide-react"
import { ShimmerSkeleton } from "@/shared/ui/ShimmerSkeleton"
import { MagneticButton } from "@/shared/ui/MagneticButton"

export function PricingCards() {
  const { data: plans, isLoading } = useFetch<any[]>("/api/subscriptions/plans")

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => <ShimmerSkeleton key={i} variant="card" className="h-72" />)}
      </div>
    )
  }

  if (!plans?.length) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-muted-foreground">暂无可用方案</p>
      </div>
    )
  }

  const features = (plan: any) => {
    const list = ["无限下载报告与图表", "公开内容浏览"]
    if (plan.customReportCount > 0) list.push(`${plan.customReportCount}次定制分析/${plan.type === "monthly" ? "月" : "年"}`)
    if (plan.type === "yearly") list.push("年付优惠")
    return list
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-foreground mb-4">选择方案</h2>
      <p className="text-center text-muted-foreground mb-12">按需选择，随时可取消</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => {
          const card = (
            <GlassCard level={2} className="p-8 h-full flex flex-col">
              <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-black text-foreground">¥{plan.price}</span>
                <span className="text-muted-foreground ml-1">/{plan.type === "monthly" ? "月" : plan.type === "yearly" ? "年" : "次"}</span>
              </div>
              <ul className="space-y-3 flex-1">
                {features(plan).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check size={16} className="text-success flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <MagneticButton maxOffset={8} className="w-full mt-8">
                <Button variant={plan.type === "yearly" ? "primary" : "secondary"} className="w-full">
                  选择方案
                </Button>
              </MagneticButton>
            </GlassCard>
          )

          if (plan.type === "yearly") {
            return <AnimatedBorder key={plan.id}>{card}</AnimatedBorder>
          }
          return <div key={plan.id}>{card}</div>
        })}
      </div>
    </div>
  )
}