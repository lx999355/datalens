"use client"
import { cn } from "@/shared/lib/utils"
import { X } from "lucide-react"
import { useEffect } from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "relative w-full max-w-lg backdrop-blur-[50px] bg-white/[0.05] border border-white/[0.12] rounded-[3rem]",
          "shadow-[0_25px_60px_-12px_rgba(0,0,0,0.5)] p-8 animate-in",
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <button onClick={onClose} className="p-1 rounded-xl hover:bg-white/[0.1] transition-colors">
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}