"use client"
import { useRef, useState, useCallback } from "react"
import { cn } from "@/shared/lib/utils"

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  maxTilt?: number
}

export function TiltCard({ children, className, maxTilt = 8 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState({ transform: "", transition: "" })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      const rotateX = (y - 0.5) * maxTilt
      const rotateY = (x - 0.5) * -maxTilt
      requestAnimationFrame(() => {
        setStyle({
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`,
          transition: "transform 0.1s ease",
        })
      })
    },
    [maxTilt]
  )

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)",
      transition: "transform 0.3s ease",
    })
  }, [])

  return (
    <div
      ref={cardRef}
      className={cn(
        "transition-all duration-300",
        className
      )}
      style={{
        transform: style.transform || "perspective(1000px) rotateX(0deg) rotateY(0deg)",
        transition: style.transition || "transform 0.3s ease",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}