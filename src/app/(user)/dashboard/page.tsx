"use client"
import { KpiCards, QuickActions } from "@/modules/dashboard/components/DashboardContent"

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">工作台</h1>
        <p className="text-muted-foreground">管理你的报告、图表和订单</p>
      </div>
      <KpiCards />
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">快捷操作</h2>
        <QuickActions />
      </div>
    </div>
  )
}