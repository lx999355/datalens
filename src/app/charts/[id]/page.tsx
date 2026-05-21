"use client"
import { use } from "react"
import { useFetch } from "@/shared/hooks/useFetch"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Badge } from "@/shared/ui/Badge"
import { Icon } from "@/shared/ui/Icon"
import { Avatar } from "@/shared/ui/Avatar"
import { ErrorState } from "@/shared/ui/ErrorState"
import { ShimmerSkeleton } from "@/shared/ui/ShimmerSkeleton"
import { Eye, Download, Heart, MessageSquare, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { formatDateTime } from "@/shared/lib/utils"

export default function ChartDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: chart, error, isLoading, refetch } = useFetch<any>(`/api/charts/${id}`)

  if (isLoading) return <div className="p-6 lg:p-8"><ShimmerSkeleton variant="card" className="h-96" /></div>
  if (error) return <div className="p-6 lg:p-8"><ErrorState onRetry={refetch} /></div>
  if (!chart) return null

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Icon icon={ArrowLeft} size={16} />返回首页
        </Link>

        <GlassCard level={2} className="p-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">{chart.title}</h1>
            <Badge>{chart.type === "generated" ? "生成" : "图片"}</Badge>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Avatar src={chart.user?.avatar} size="sm" />
            <div>
              <p className="text-foreground font-medium">{chart.user?.username}</p>
              <p className="text-xs text-muted-foreground">{formatDateTime(chart.createdAt)}</p>
            </div>
          </div>

          {chart.description && (
            <p className="text-muted-foreground mb-6">{chart.description}</p>
          )}

          {/* Chart image */}
          <div className="bg-white/[0.03] rounded-2xl p-6 mb-6 min-h-[300px] flex items-center justify-center">
            {chart.fileUrl && (
              <img src={chart.fileUrl} alt={chart.title} className="max-w-full max-h-[500px] object-contain rounded-xl" />
            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Icon icon={Eye} size={16} />{chart.viewCount}</span>
            <span className="flex items-center gap-1"><Icon icon={Download} size={16} />{chart.downloadCount}</span>
            <span className="flex items-center gap-1"><Icon icon={Heart} size={16} />{chart.likeCount}</span>
            <span className="flex items-center gap-1"><Icon icon={MessageSquare} size={16} />{chart.commentCount}</span>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}