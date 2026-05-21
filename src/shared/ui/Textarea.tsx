"use client"
import { cn } from "@/shared/lib/utils"
import { TextareaHTMLAttributes, forwardRef } from "react"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
        <textarea
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.1] rounded-2xl text-foreground placeholder:text-muted-foreground resize-none",
            "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-200",
            error && "border-danger/50",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"