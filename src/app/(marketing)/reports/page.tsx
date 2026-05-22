"use client"
import { useState } from "react"
import { useFetch } from "@/shared/hooks/useFetch"
import { usePagination } from "@/shared/hooks/usePagination"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Input } from "@/shared/ui/Input"
import { Tabs } from "@/shared/ui/Tabs"
import { Pagination } from "@/shared/ui/Pagination"
import { EmptyState } from "@/shared/ui/EmptyState"
import { ErrorState } from "@/shared/ui/ErrorState"
import { ShimmerSkeleton } from "@/shared/ui/ShimmerSkeleton"
import { Badge } from "@/shared/ui/Badge"
import { Icon } from "@/shared/ui/Icon"
import { MagneticButton } from "@/shared/ui/MagneticButton"
import { Eye, Download, FileText } from "lucide-react"
import { ReportDTO } from "@/shared/types/report"

const tabs = [
  { key: "all", label: "全部" },
  { key: "reports", label: "报告" },
  { key: "charts", label: "图表" },
]

export default function PublicReportsPage() {
  const [type, setType] = useState("all")
  const [search, setSearch] = useState("")
  const { page, pageSize, goToPage } = usePagination()

  const url = `/api/reports?type=${type}&page=${page}&pageSize=${pageSize}${search ? `&search=${encodeURIComponent(search)}` : ""}`

  const { data, isLoading, error, refetch } = useFetch<{
    items: ReportDTO[]
    total: number
  }>(url)

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">浏览公开内容</h1>
        <p className="text-muted-foreground mb-8">发现来自社区的数据报告和图表</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="搜索报告或图表..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); goToPage(1) }}
            className="max-w-xs"
          />
          <Tabs tabs={tabs} activeTab={type} onTabChange={(key) => { setType(key); goToPage(1) }} />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ShimmerSkeleton key={i} variant="card" className="h-64" />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : !data?.items?.length ? (
          <EmptyState icon={FileText} title="暂无公开内容" description="还没有人分享报告或图表" />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.items.map((item: ReportDTO) => (
                <MagneticButton key={item.id} href={`/reports/${item.id}`} maxOffset={4}>
                  <GlassCard level={2} hover className="p-6 h-full">
                    <Badge>{item.type === "finished" ? "报告" : "图表"}</Badge>
                    <h3 className="text-lg font-semibold text-foreground mt-3 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
                      <span className="inline-flex items-center gap-1">
                        <Icon icon={Eye} size={14} /> {item.viewCount || 0}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Icon icon={Download} size={14} /> {item.downloadCount || 0}
                      </span>
                    </div>
                  </GlassCard>
                </MagneticButton>
              ))}
            </div>
            <div className="mt-8">
              <Pagination
                page={page}
                totalPages={Math.ceil((data.total || 0) / pageSize)}
                onPageChange={goToPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
