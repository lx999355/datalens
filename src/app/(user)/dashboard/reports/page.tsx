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
import { StaggerReveal, StaggerItem } from "@/shared/ui/StaggerReveal"
import { FileText, Plus, Eye, Download, Heart, MessageSquare } from "lucide-react"
import Link from "next/link"
import { ReportDTO } from "@/shared/types/report"
import { MagneticButton } from "@/shared/ui/MagneticButton"

export default function ReportsPage() {
  const { page, goToPage } = usePagination()
  const [type, setType] = useState("")
  const [search, setSearch] = useState("")

  const params = new URLSearchParams({ page: String(page), type, search })
  const { data, error, isLoading, refetch } = useFetch<{
    items: ReportDTO[], total: number, page: number, pageSize: number, totalPages: number
  }>(`/api/reports?${params}`)

  if (error) return <ErrorState onRetry={refetch} />

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">我的报告</h1>
        <MagneticButton href="/dashboard/reports/upload" maxOffset={6}>
          <Button><Icon icon={Plus} size={16} />上传报告</Button>
        </MagneticButton>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input placeholder="搜索报告..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <Tabs
          tabs={[{ key: "", label: "全部" }, { key: "finished", label: "成品" }, { key: "source_data", label: "源数据" }]}
          activeTab={type}
          onTabChange={setType}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <ShimmerSkeleton key={i} variant="card" className="h-40" />)}
        </div>
      ) : !data?.items.length ? (
        <EmptyState icon={FileText} title="暂无报告" description="上传你的第一份数据报告" actionLabel="上传报告" onAction={() => {}} />
      ) : (
        <>
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.items.map((report) => (
              <StaggerItem key={report.id}>
                <Link href={`/reports/${report.id}`}>
                  <GlassCard level={2} hover className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-foreground truncate flex-1">{report.title}</h3>
                      <Badge variant={report.visibility === "public" ? "info" : "default"}>
                        {report.visibility === "public" ? "公开" : "私密"}
                      </Badge>
                    </div>
                    {report.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{report.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Icon icon={Eye} size={12} />{report.viewCount}</span>
                      <span className="flex items-center gap-1"><Icon icon={Download} size={12} />{report.downloadCount}</span>
                      <span className="flex items-center gap-1"><Icon icon={Heart} size={12} />{report.likeCount}</span>
                      <span className="flex items-center gap-1"><Icon icon={MessageSquare} size={12} />{report.commentCount}</span>
                    </div>
                  </GlassCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerReveal>
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={goToPage} />
        </>
      )}
    </div>
  )
}
