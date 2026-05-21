"use client"
import { cn } from "@/shared/lib/utils"

interface TabsProps {
  tabs: { key: string; label: string; count?: number }[]
  activeTab: string
  onTabChange: (key: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 p-1 bg-white/[0.03] rounded-2xl border border-white/[0.06]", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium transition-all",
            activeTab === tab.key
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1.5 text-xs opacity-70">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  )
}