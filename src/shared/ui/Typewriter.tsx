"use client"
import { useState, useEffect } from "react"
import { cn } from "@/shared/lib/utils"

interface TypewriterProps {
  texts: string[]
  className?: string
  speed?: number
  deleteSpeed?: number
  pauseTime?: number
}

export function Typewriter({
  texts,
  className,
  speed = 80,
  deleteSpeed = 40,
  pauseTime = 2000,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("")
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    const currentText = texts[textIndex]

    if (!deleting && charIndex === currentText.length) {
      const timer = setTimeout(() => setDeleting(true), pauseTime)
      return () => clearTimeout(timer)
    }

    if (deleting && charIndex === 0) {
      setDeleting(false)
      setTextIndex((prev) => (prev + 1) % texts.length)
      return
    }

    const timer = setTimeout(
      () => {
        setDisplayText(currentText.substring(0, charIndex + (deleting ? 0 : 1)))
        setCharIndex((prev) => prev + (deleting ? -1 : 1))
      },
      deleting ? deleteSpeed : speed
    )

    return () => clearTimeout(timer)
  }, [charIndex, deleting, textIndex, texts, speed, deleteSpeed, pauseTime])

  return (
    <span className={cn("inline", className)}>
      {displayText}
      <span
        className={cn(
          "inline-block w-[2px] h-[1em] bg-primary ml-0.5 align-middle -mt-[2px]",
          "transition-opacity duration-100",
          showCursor ? "opacity-100" : "opacity-0"
        )}
      />
    </span>
  )
}