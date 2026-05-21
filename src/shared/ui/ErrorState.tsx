"use client"
import { cn } from "@/shared/lib/utils"
import { AlertCircle } from "lucide-react"
import { Icon } from "./Icon"
import { Button } from "./Button"

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ message = "加载失败，请重试", onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <div className="p-4 rounded-full bg-danger/10 border border-danger/20 mb-4">
        <Icon icon={AlertCircle} size={32} className="text-danger" />
      </div>
      <p className="text-muted-foreground mb-4">{message}</p>
      {onRetry && <Button variant="secondary" onClick={onRetry}>重试</Button>}
    </div>
  )
}