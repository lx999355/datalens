"use client"
import { useEffect } from "react"

export function CursorGlow() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--cursor-x", e.clientX + "px")
      document.documentElement.style.setProperty("--cursor-y", e.clientY + "px")
    }
    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return <div className="cursor-glow" aria-hidden="true" />
}