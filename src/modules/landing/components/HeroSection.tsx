"use client"
import { MagneticButton } from "@/shared/ui/MagneticButton"
import { StaggerReveal, StaggerItem } from "@/shared/ui/StaggerReveal"

export function HeroSection() {
  return (
    <section className="relative px-4 py-24 sm:py-32 lg:py-40 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <StaggerReveal>
          <StaggerItem>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                数据洞察
              </span>
              <br />
              <span className="text-foreground">触手可及</span>
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              上传数据分析报告与可视化图表，分享你的洞察发现。
              浏览公开内容、提交定制化分析需求，用数据驱动决策。
            </p>
          </StaggerItem>
          <StaggerItem>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton onClick={() => { window.location.href = "/register" }} maxOffset={6}>
                <span className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-2xl text-lg font-medium shadow-[0_0_20px_rgba(96,165,250,0.3)]">
                  免费开始
                </span>
              </MagneticButton>
              <MagneticButton onClick={() => { window.location.href = "/pricing" }} maxOffset={6}>
                <span className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/[0.05] border border-white/[0.1] text-foreground rounded-2xl text-lg font-medium">
                  查看定价
                </span>
              </MagneticButton>
            </div>
          </StaggerItem>
        </StaggerReveal>

        {/* Decorative floating icons */}
        <div className="absolute top-20 left-[10%] float" style={{ "--float-delay": "0s" } as React.CSSProperties}>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center backdrop-blur-sm">
            <span className="text-lg">📊</span>
          </div>
        </div>
        <div className="absolute top-40 right-[12%] float" style={{ "--float-delay": "1s" } as React.CSSProperties}>
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center backdrop-blur-sm">
            <span className="text-lg">📈</span>
          </div>
        </div>
        <div className="absolute bottom-20 left-[15%] float" style={{ "--float-delay": "2s" } as React.CSSProperties}>
          <div className="w-10 h-10 rounded-xl bg-info/10 border border-info/20 flex items-center justify-center backdrop-blur-sm">
            <span className="text-lg">📉</span>
          </div>
        </div>
        <div className="absolute bottom-40 right-[18%] float" style={{ "--float-delay": "3s" } as React.CSSProperties}>
          <div className="w-14 h-14 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center backdrop-blur-sm">
            <span className="text-xl">🔍</span>
          </div>
        </div>
      </div>
    </section>
  )
}