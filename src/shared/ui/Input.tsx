"use client"
import { cn } from "@/shared/lib/utils"
import { InputHTMLAttributes, forwardRef } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.1] rounded-2xl text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-200",
            error && "border-danger/50 focus:border-danger focus:ring-danger/30",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        {hint && !error && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"