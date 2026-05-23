"use client"
import { use, useState } from "react"
import { useFetch } from "@/shared/hooks/useFetch"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Badge } from "@/shared/ui/Badge"
import { Icon } from "@/shared/ui/Icon"
import { Avatar } from "@/shared/ui/Avatar"
import { ErrorState } from "@/shared/ui/ErrorState"
import { ShimmerSkeleton } from "@/shared/ui/ShimmerSkeleton"
import { useToast } from "@/shared/ui/Toast"
import { Eye, Download, Heart, MessageSquare, ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { formatDateTime } from "@/shared/lib/utils"

export default function ChartDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: chart, isLoading, refetch } = useFetch<any>(`/api/charts/${id}`)
  const { addToast } = useToast()
  const [current, setCurrent] = useState(0)
  const [liking, setLiking] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handleLike = async () => {
    setLiking(true)
    try {
      const res = await fetch(`/api/charts/${id}/like`, { method: "POST" })
      const json = await res.json()
      if (json.data) {
        addToast("success", json.data.liked ? "已点赞" : "已取消点赞")
        refetch()
      }
    } catch { addToast("error", "操作失败") }
    finally { setLiking(false) }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await fetch(`/api/charts/${id}/download`, { method: "POST" })
      refetch()
      // 下载原图
      const img = allImages[current]
      const a = document.createElement("a")
      a.href = img
      a.download = chart.title || "chart"
      a.click()
    } catch { addToast("error", "下载失败") }
    finally { setDownloading(false) }
  }

  if (isLoading || !chart) return <div className="p-6 lg:p-8"><ShimmerSkeleton variant="card" className="h-96" /></div>

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
            <img
              src={allImages[current]}
              alt={`${chart.title} (${current + 1}/${allImages.length})`}
              className="max-w-full max-h-[500px] object-contain rounded-xl"
            />
            {hasMultiple && (
              <>
                <button className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                  onClick={() => setCurrent((p) => (p - 1 + allImages.length) % allImages.length)}>
                  <Icon icon={ChevronLeft} size={20} />
                </button>
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                  onClick={() => setCurrent((p) => (p + 1) % allImages.length)}>
                  <Icon icon={ChevronRight} size={20} />
                </button>
              </>
            )}
          </div>

          {/* 缩略图条 */}
          {hasMultiple && (
            <>
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {allImages.map((url, i) => (
                  <button key={i} className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 ${i === current ? "border-primary" : "border-transparent"}`}
                    onClick={() => setCurrent(i)}>
                    <img src={url} alt={`${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <p className="text-center text-xs text-muted-foreground mb-6">{current + 1} / {allImages.length}</p>
            </>
          )}

          {/* 操作按钮 */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Icon icon={Eye} size={16} />{chart.viewCount}</span>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1 hover:text-foreground transition-colors disabled:opacity-50"
            >
              <Icon icon={downloading ? Loader2 : Download} size={16} className={downloading ? "animate-spin" : ""} />
              {chart.downloadCount}
            </button>
            <button
              onClick={handleLike}
              disabled={liking}
              className={`flex items-center gap-1 transition-colors disabled:opacity-50 ${chart.hasLiked ? "text-red-500" : "hover:text-foreground"}`}
            >
              <Icon icon={liking ? Loader2 : Heart} size={16} className={liking ? "animate-spin" : ""} />
              {chart.likeCount}
            </button>
            <Link href={`/charts/${id}?comment=1`} className="flex items-center gap-1 hover:text-foreground transition-colors" scroll={false}>
              <Icon icon={MessageSquare} size={16} />{chart.commentCount}
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
