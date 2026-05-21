"use client"
import { useRef, useState, useCallback, Children } from "react"
import { cn } from "@/shared/lib/utils"

interface SpotlightGridProps {
  children: React.ReactNode
  className?: string
}

export function SpotlightGrid({ children, className }: SpotlightGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [spotlightIndex, setSpotlightIndex] = useState<number | null>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (throttleRef.current) return
      throttleRef.current = setTimeout(() => {
        throttleRef.current = null
        if (!gridRef.current) return
        const cells = gridRef.current.children
        let minDist = Infinity
        let closest = -1
        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i] as HTMLElement
          const rect = cell.getBoundingClientRect()
          const cx = rect.left + rect.width / 2
          const cy = rect.top + rect.height / 2
          const dist = Math.hypot(e.clientX - cx, e.clientY - cy)
          if (dist < minDist) {
            minDist = dist
            closest = i
          }
        }
        setSpotlightIndex(closest)
      }, 50)
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    setSpotlightIndex(null)
  }, [])

  const childArray = Children.toArray(children)

  return (
    <div
      ref={gridRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {childArray.map((child, i) => (
        <div
          key={i}
          data-spotlight={i === spotlightIndex ? "true" : undefined}
          className={cn(
            "transition-all duration-300",
            i === spotlightIndex && "border-primary/30 shadow-[0_0_20px_rgba(96,165,250,0.15)]"
          )}
        >
          {child}
        </div>
      ))}
    </div>
  )
}