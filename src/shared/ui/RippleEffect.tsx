"use client"
import { useState, useCallback } from "react"
import { cn } from "@/shared/lib/utils"

export function useRipple() {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])

  const createRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples((prev) => [...prev, { x, y, id }])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 400)
  }, [])

  return { ripples, createRipple }
}

interface RippleContainerProps {
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export function RippleContainer({ children, className, onClick }: RippleContainerProps) {
  const { ripples, createRipple } = useRipple()

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    createRipple(e)
    onClick?.(e)
  }

  return (
    <div className={cn("relative overflow-hidden", className)} onClick={handleClick}>
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute w-4 h-4 bg-white/20 rounded-full pointer-events-none animate-ripple"
          style={{ left: r.x - 8, top: r.y - 8 }}
        />
      ))}
    </div>
  )
}