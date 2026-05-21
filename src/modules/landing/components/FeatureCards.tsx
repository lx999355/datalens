"use client"
import { TiltCard } from "@/shared/ui/TiltCard"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Icon } from "@/shared/ui/Icon"
import { SpotlightGrid } from "@/shared/ui/SpotlightGrid"
import { Typewriter } from "@/shared/ui/Typewriter"
import { MagneticButton } from "@/shared/ui/MagneticButton"
import { FileUp, BarChart3, Palette, Users } from "lucide-react"

const features = [
  {
    icon: FileUp,
    title: "上传与分享",
    description: "上传PDF、Word、Excel报告和图表，一键分享你的数据洞察",
    href: "/dashboard/reports",
  },
  {
    icon: BarChart3,
    title: "数据生成图表",
    description: "上传CSV/Excel源数据，选择图表类型，自动生成交互式可视化",
    href: "/dashboard/charts/generate",
  },
  {
    icon: Palette,
    title: "定制化分析",
    description: "提交定制化报告需求，专业分析师为你深度解读数据",
    href: "/dashboard/orders/custom/new",
  },
  {
    icon: Users,
    title: "社区互动",
    description: "浏览公开内容、点赞评论、关注创作者，发现更多数据价值",
    href: "/pricing",
  },
]

export function FeatureCards() {
  return (
    <section className="px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-foreground mb-4">
          核心功能
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          <Typewriter
            texts={[
              "从上传到分享，从浏览到定制，DataLens 为你提供完整的数据分析工作流",
              "连接数据，发现洞察，创造价值",
              "让数据说话，让分析更简单",
            ]}
            speed={60}
            pauseTime={3000}
          />
        </p>
        <SpotlightGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <TiltCard key={feature.title}>
              <MagneticButton href={feature.href} maxOffset={6} className="h-full w-full">
                <GlassCard level={2} hover className="p-6 h-full cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Icon icon={feature.icon} size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </GlassCard>
              </MagneticButton>
            </TiltCard>
          ))}
        </SpotlightGrid>
      </div>
    </section>
  )
}