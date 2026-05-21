"use client"
import { cn } from "@/shared/lib/utils"
import { useState } from "react"

interface AnimatedBorderProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedBorder({ children, className }: AnimatedBorderProps) {
  const [hover, setHover] = useState(false)

  return (
    <div
      className={cn("relative p-[2px] rounded-[2.5rem] overflow-hidden", className)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-[2.5rem]",
          hover ? "animate-border-spin-fast" : "animate-border-spin"
        )}
        style={{
          background: "conic-gradient(from 0deg, #60a5fa, #8b5cf6, #60a5fa)",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))",
          WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}