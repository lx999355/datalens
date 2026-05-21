"use client"
import { useRef, useState, useCallback, useEffect } from "react"
import { cn } from "@/shared/lib/utils"

interface DragToRevealProps {
  left: React.ReactNode
  right: React.ReactNode
  className?: string
}

export function DragToReveal({ left, right, className }: DragToRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(50)
  const dragging = useRef(false)

  const updatePosition = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const pct = Math.min(90, Math.max(10, (x / rect.width) * 100))
      setPosition(pct)
    },
    []
  )

  const handleDragStop = useCallback(() => {
    dragging.current = false
  }, [])

  // Global listeners to prevent drag-stuck on mouse-out
  useEffect(() => {
    const onMouseUp = () => handleDragStop()
    const onTouchEnd = () => handleDragStop()
    document.addEventListener("mouseup", onMouseUp)
    document.addEventListener("touchend", onTouchEnd)
    return () => {
      document.removeEventListener("mouseup", onMouseUp)
      document.removeEventListener("touchend", onTouchEnd)
    }
  }, [handleDragStop])

  const handleMouseDown = useCallback(() => {
    dragging.current = true
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (dragging.current) updatePosition(e.clientX)
    },
    [updatePosition]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) updatePosition(e.touches[0].clientX)
    },
    [updatePosition]
  )

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden select-none", className)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      <div style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>{left}</div>
      <div style={{ clipPath: `inset(0 0 0 ${position}%)` }} className="absolute inset-0">
        {right}
      </div>
      <div
        className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize z-10 rounded-full"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      />
    </div>
  )
}