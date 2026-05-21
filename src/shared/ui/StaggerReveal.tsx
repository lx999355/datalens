"use client"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/shared/lib/utils"

interface StaggerRevealProps {
  children: React.ReactNode
  className?: string
}

export function StaggerReveal({ children, className }: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "-50px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn("stagger-reveal", isVisible && "stagger-reveal--visible", className)}
    >
      {children}
    </div>
  )
}

export function StaggerItem({ children, className }: StaggerRevealProps) {
  return (
    <div className={cn("stagger-item", className)}>
      {children}
    </div>
  )
}
