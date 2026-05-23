"use client"
import { useState } from "react"
import { useFetch } from "@/shared/hooks/useFetch"
import { usePagination } from "@/shared/hooks/usePagination"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Button } from "@/shared/ui/Button"
import { Input } from "@/shared/ui/Input"
import { Tabs } from "@/shared/ui/Tabs"
import { Pagination } from "@/shared/ui/Pagination"
import { EmptyState } from "@/shared/ui/EmptyState"
import { ErrorState } from "@/shared/ui/ErrorState"
import { ShimmerSkeleton } from "@/shared/ui/ShimmerSkeleton"
import { Badge } from "@/shared/ui/Badge"
import { Icon } from "@/shared/ui/Icon"
import { BarChart3, Plus, Eye, Download, Heart, MessageSquare, Images } from "lucide-react"
import Link from "next/link"
import { ChartDTO } from "@/shared/types/chart"

export default function ChartsPage() {
  const { page, goToPage } = usePagination()
  const [type, setType] = useState("")
  const [search, setSearch] = useState("")

  const params = new URLSearchParams({ page: String(page), type, search })
  const { data, error, isLoading, refetch } = useFetch<{
    items: ChartDTO[], total: number, page: number, pageSize: number, totalPages: number
  }>(`/api/charts?${params}`)

  if (error) return <ErrorState onRetry={refetch} />

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">我的图表</h1>
        <div className="flex gap-2">
          <a href="/dashboard/charts/upload" className="no-underline">
            <Button variant="secondary"><Icon icon={Plus} size={16} />上传图片</Button>
          </a>
          <a href="/dashboard/charts/generate" className="no-underline">
            <Button><Icon icon={BarChart3} size={16} />数据生成</Button>
          </a>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input placeholder="搜索图表..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <Tabs
          tabs={[{ key: "", label: "全部" }, { key: "image", label: "图片" }, { key: "generated", label: "生成" }]}
          activeTab={type} onTabChange={setType}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <ShimmerSkeleton key={i} variant="card" className="h-40" />)}
        </div>
      ) : !data?.items?.length ? (
        <EmptyState icon={BarChart3} title="暂无图表" description="上传图表图片或从数据生成" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.items.map((chart) => (
              <Link key={chart.id} href={`/charts/${chart.id}`}>
                <GlassCard level={2} hover className="p-4 h-full">
                  {chart.fileUrl ? (
                    <div className="relative h-32 rounded-xl bg-white/[0.03] mb-3 overflow-hidden">
                      <img src={chart.fileUrl} alt={chart.title} className="w-full h-full object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                      {chart.images && (chart.images as string[]).length > 1 && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 text-white text-xs">
                          <Icon icon={Images} size={12} />{(chart.images as string[]).length}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-32 rounded-xl bg-white/[0.03] mb-3 flex items-center justify-center">
                      <Icon icon={BarChart3} size={32} className="text-muted-foreground" />
                    </div>
                  )}
                  <h3 className="font-semibold text-foreground truncate">{chart.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <Badge variant={chart.type === "generated" ? "success" : "default"}>
                      {chart.type === "generated" ? "生成" : "图片"}
                    </Badge>
                    <span className="flex items-center gap-1"><Icon icon={Eye} size={12} />{chart.viewCount}</span>
                    <span className="flex items-center gap-1"><Icon icon={Heart} size={12} />{chart.likeCount}</span>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={goToPage} />
        </>
      )}
    </div>
  )
}
