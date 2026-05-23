"use client"
import { use, useState } from "react"
import { useFetch } from "@/shared/hooks/useFetch"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Badge } from "@/shared/ui/Badge"
import { Icon } from "@/shared/ui/Icon"
import { Avatar } from "@/shared/ui/Avatar"
import { ErrorState } from "@/shared/ui/ErrorState"
import { ShimmerSkeleton } from "@/shared/ui/ShimmerSkeleton"
import { Eye, Download, Heart, MessageSquare, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { formatDateTime } from "@/shared/lib/utils"

export default function ChartDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: chart, error, isLoading, refetch } = useFetch<any>(`/api/charts/${id}`)
  const [current, setCurrent] = useState(0)

  if (isLoading) return <div className="p-6 lg:p-8"><ShimmerSkeleton variant="card" className="h-96" /></div>
  if (error) return <div className="p-6 lg:p-8"><ErrorState onRetry={refetch} /></div>
  if (!chart) return null

  // 合并所有图片：封面 + images 数组
  const allImages: string[] = [chart.fileUrl]
  if (chart.images && Array.isArray(chart.images)) {
    allImages.push(...(chart.images as string[]))
  }

  const hasMultiple = allImages.length > 1

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

          {/* 图片展示区 */}
          <div className="bg-white/[0.03] rounded-2xl p-6 mb-6 min-h-[300px] flex items-center justify-center relative">
            {/* 主图 */}
            <img
              src={allImages[current]}
              alt={`${chart.title} (${current + 1}/${allImages.length})`}
              className="max-w-full max-h-[500px] object-contain rounded-xl"
            />

            {/* 左右切换 */}
            {hasMultiple && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  onClick={() => setCurrent((p) => (p - 1 + allImages.length) % allImages.length)}
                >
                  <Icon icon={ChevronLeft} size={20} />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  onClick={() => setCurrent((p) => (p + 1) % allImages.length)}
                >
                  <Icon icon={ChevronRight} size={20} />
                </button>
              </>
            )}
          </div>

          {/* 缩略图条 */}
          {hasMultiple && (
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {allImages.map((url, i) => (
                <button
                  key={i}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === current ? "border-primary" : "border-transparent"}`}
                  onClick={() => setCurrent(i)}
                >
                  <img src={url} alt={`${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* 页码指示器 */}
          {hasMultiple && (
            <p className="text-center text-xs text-muted-foreground mb-6">
              {current + 1} / {allImages.length}
            </p>
          )}

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
