"use client"
import { cn } from "@/shared/lib/utils"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { createContext, useContext, useState, useCallback } from "react"

type ToastType = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextType {
  addToast: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast(): ToastContextType {
  const context = useContext(ToastContext)
  if (!context) {
    return { addToast: () => {} }
  }
  return context
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colorMap = {
  success: "border-success/30 bg-success/10",
  error: "border-danger/30 bg-danger/10",
  warning: "border-warning/30 bg-warning/10",
  info: "border-info/30 bg-info/10",
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type]
          return (
            <div
              key={toast.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-[50px] animate-in shadow-lg",
                colorMap[toast.type]
              )}
            >
              <Icon size={18} />
              <p className="text-sm text-foreground flex-1">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="p-0.5 rounded-lg hover:bg-white/[0.1]">
                <X size={14} className="text-muted-foreground" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}