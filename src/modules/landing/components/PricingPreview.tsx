"use client"
import { GlassCard } from "@/shared/ui/GlassCard"
import { AnimatedBorder } from "@/shared/ui/AnimatedBorder"
import { Button } from "@/shared/ui/Button"
import { Check } from "lucide-react"
import { MagneticButton } from "@/shared/ui/MagneticButton"

const plans = [
  {
    name: "月付方案",
    type: "monthly",
    price: 29,
    unit: "月",
    features: ["无限下载报告与图表", "每月5次定制分析", "优先客服支持", "公开内容浏览"],
    highlighted: false,
  },
  {
    name: "年付方案",
    type: "yearly",
    price: 288,
    unit: "年",
    features: ["无限下载报告与图表", "每年15次定制分析", "优先客服支持", "公开内容浏览", "年付优惠省20%"],
    highlighted: true,
  },
]

export function PricingPreview() {
  return (
    <section className="px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-foreground mb-4">
          简单透明的定价
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          选择适合你的方案，随时可取消
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => {
            const card = (
              <GlassCard level={2} className="p-8 h-full flex flex-col">
                <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-black text-foreground">¥{plan.price}</span>
                  <span className="text-muted-foreground ml-1">/{plan.unit}</span>
                </div>
                <ul className="space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check size={16} className="text-success flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <MagneticButton href="/pricing" maxOffset={8} className="mt-8 block w-full">
                  <Button variant={plan.highlighted ? "primary" : "secondary"} className="w-full">
                    选择方案
                  </Button>
                </MagneticButton>
              </GlassCard>
            )

            if (plan.highlighted) {
              return (
                <AnimatedBorder key={plan.name}>
                  {card}
                </AnimatedBorder>
              )
            }
            return <div key={plan.name}>{card}</div>
          })}
        </div>
      </div>
    </section>
  )
}