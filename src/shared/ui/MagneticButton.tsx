"use client"
import { useRef, useState, useCallback } from "react"
import { cn } from "@/shared/lib/utils"
import { useRouter } from "next/navigation"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  href?: string
  maxOffset?: number
}

export function MagneticButton({
  children, className, onClick, href, maxOffset = 12
}: MagneticButtonProps) {
  const outerRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isActive, setIsActive] = useState(false)
  const router = useRouter()

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!outerRef.current) return
      const rect = outerRef.current.getBoundingClientRect()
      const x = e.clientX - (rect.left + rect.width / 2)
      const y = e.clientY - (rect.top + rect.height / 2)
      const factor = maxOffset / Math.max(rect.width / 2, 1)
      setOffset({ x: x * factor, y: y * factor })
      setIsActive(true)
    },
    [maxOffset]
  )

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 })
    setIsActive(false)
  }, [])

  const handleClick = useCallback(() => {
    if (href) {
      router.push(href)
    }
    onClick?.()
  }, [href, onClick, router])

  return (
    <div
      ref={outerRef}
      className="relative inline-block p-3 -m-3 cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div
        className={cn(
          "magnetic-elastic inline-block",
          isActive && "scale-[1.03]",
          className
        )}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        {children}
      </div>
    </div>
  )
}