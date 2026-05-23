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
import { Eye, Download, Heart, MessageSquare, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { formatDateTime } from "@/shared/lib/utils"

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: report, isLoading, refetch } = useFetch<any>(`/api/reports/${id}`)
  const { addToast } = useToast()
  const [liking, setLiking] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handleLike = async () => {
    setLiking(true)
    try {
      const res = await fetch(`/api/reports/${id}/like`, { method: "POST" })
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
      await fetch(`/api/reports/${id}/download`, { method: "POST" })
      refetch()
      window.open(report.fileUrl, "_blank")
    } catch { addToast("error", "下载失败") }
    finally { setDownloading(false) }
  }

  if (isLoading || !report) return <div className="p-6 lg:p-8"><ShimmerSkeleton variant="card" className="h-96" /></div>

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Icon icon={ArrowLeft} size={16} />返回首页
        </Link>

        <GlassCard level={2} className="p-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">{report.title}</h1>
            <Badge variant={report.visibility === "public" ? "info" : "default"}>
              {report.visibility === "public" ? "公开" : "私密"}
            </Badge>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Avatar src={report.user?.avatar} size="sm" />
            <div>
              <p className="text-foreground font-medium">{report.user?.username}</p>
              <p className="text-xs text-muted-foreground">{formatDateTime(report.createdAt)}</p>
            </div>
          </div>

          {report.description && (
            <p className="text-muted-foreground mb-6">{report.description}</p>
          )}

          <div className="bg-white/[0.03] rounded-2xl p-6 mb-6 min-h-[200px] flex items-center justify-center">
            {report.fileType?.includes("pdf") ? (
              <iframe src={report.fileUrl} className="w-full h-[600px] rounded-xl" title="PDF预览" />
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground mb-4">文件预览</p>
                <a href={report.fileUrl} target="_blank" className="text-primary hover:underline">打开文件</a>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Icon icon={Eye} size={16} />{report.viewCount}</span>
            <button onClick={handleDownload} disabled={downloading} className="flex items-center gap-1 hover:text-foreground transition-colors disabled:opacity-50">
              <Icon icon={downloading ? Loader2 : Download} size={16} className={downloading ? "animate-spin" : ""} />
              {report.downloadCount}
            </button>
            <button onClick={handleLike} disabled={liking}
              className={`flex items-center gap-1 transition-colors disabled:opacity-50 ${report.hasLiked ? "text-red-500" : "hover:text-foreground"}`}>
              <Icon icon={liking ? Loader2 : Heart} size={16} className={liking ? "animate-spin" : ""} />
              {report.likeCount}
            </button>
            <Link href={`/reports/${id}?comment=1`} className="flex items-center gap-1 hover:text-foreground transition-colors" scroll={false}>
              <Icon icon={MessageSquare} size={16} />{report.commentCount}
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
