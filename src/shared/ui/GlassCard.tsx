"use client"
import { cn } from "@/shared/lib/utils"

interface GlassCardProps {
  level?: 0 | 1 | 2 | 3 | 4
  className?: string
  children: React.ReactNode
  hover?: boolean
  onClick?: () => void
}

const levelStyles = {
  0: "bg-transparent",
  1: "backdrop-blur-[20px] bg-white/[0.02] border border-white/[0.06] rounded-[2rem]",
  2: "backdrop-blur-[30px] bg-white/[0.03] border border-white/[0.08] rounded-[2.5rem]",
  3: "backdrop-blur-[50px] bg-white/[0.05] border border-white/[0.12] rounded-[3rem] shadow-[0_25px_60px_-12px_rgba(0,0,0,0.5)]",
  4: "backdrop-blur-[30px] bg-white/[0.08] border-primary/30 shadow-[0_0_30px_rgba(96,165,250,0.15)] rounded-[2.5rem]",
}

export function GlassCard({ level = 2, className, children, hover = false, onClick }: GlassCardProps) {
  return (
    <div
      className={cn(
        levelStyles[level],
        hover && "transition-all duration-300 hover:bg-white/[0.08] hover:border-primary/30 hover:shadow-[0_0_30px_rgba(96,165,250,0.15)]",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}