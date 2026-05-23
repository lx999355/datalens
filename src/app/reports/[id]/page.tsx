"use client"
import { use, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useFetch } from "@/shared/hooks/useFetch"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Badge } from "@/shared/ui/Badge"
import { Button } from "@/shared/ui/Button"
import { Icon } from "@/shared/ui/Icon"
import { Avatar } from "@/shared/ui/Avatar"
import { ShimmerSkeleton } from "@/shared/ui/ShimmerSkeleton"
import { useToast } from "@/shared/ui/Toast"
import { Eye, Download, Heart, MessageSquare, ArrowLeft, Loader2, Send } from "lucide-react"
import Link from "next/link"
import { formatDateTime } from "@/shared/lib/utils"

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const { data: report, isLoading } = useFetch<any>(`/api/reports/${id}`)
  const { addToast } = useToast()
  const [localLikeCount, setLocalLikeCount] = useState<number | null>(null)
  const [localLiked, setLocalLiked] = useState<boolean | null>(null)
  const [localDownloadCount, setLocalDownloadCount] = useState<number | null>(null)
  const [liking, setLiking] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [showComments, setShowComments] = useState(searchParams.get("comment") === "1")
  const [comments, setComments] = useState<any[]>([])
  const [commentText, setCommentText] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (report) {
      if (localLikeCount === null) setLocalLikeCount(report.likeCount)
      if (localLiked === null) setLocalLiked(report.hasLiked)
      if (localDownloadCount === null) setLocalDownloadCount(report.downloadCount)
    }
  }, [report])

  useEffect(() => {
    if (showComments) {
      fetch(`/api/reports/${id}/comments`).then(r => r.json()).then(j => {
        setComments(j.data?.items || [])
      }).catch(() => {})
    }
  }, [showComments, id])

  const handleLike = async () => {
    setLiking(true)
    try {
      const res = await fetch(`/api/reports/${id}/like`, { method: "POST" })
      const json = await res.json()
      if (json.data) {
        setLocalLiked(json.data.liked)
        setLocalLikeCount((c: number | null) => (c ?? 0) + (json.data.liked ? 1 : -1))
      }
    } catch { addToast("error", "操作失败") }
    finally { setLiking(false) }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await fetch(`/api/reports/${id}/download`, { method: "POST" })
      setLocalDownloadCount((c: number | null) => (c ?? 0) + 1)
      if (report) window.open(report.fileUrl, "_blank")
    } catch { addToast("error", "下载失败") }
    finally { setDownloading(false) }
  }

  const handleSendComment = async () => {
    if (!commentText.trim()) return
    setSending(true)
    try {
      const res = await fetch(`/api/reports/${id}/comments`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      })
      const json = await res.json()
      if (json.data) {
        setComments((prev: any[]) => [json.data, ...prev])
        setCommentText("")
      }
    } catch { addToast("error", "发送失败") }
    finally { setSending(false) }
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

          {report.description && <p className="text-muted-foreground mb-6">{report.description}</p>}

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
              {localDownloadCount ?? report.downloadCount}
            </button>
            <button onClick={handleLike} disabled={liking} className={`flex items-center gap-1 transition-colors disabled:opacity-50 ${(localLiked ?? report.hasLiked) ? "text-red-500" : "hover:text-foreground"}`}>
              <Icon icon={liking ? Loader2 : Heart} size={16} className={liking ? "animate-spin" : ""} />
              {localLikeCount ?? report.likeCount}
            </button>
            <button onClick={() => setShowComments(!showComments)} className={`flex items-center gap-1 transition-colors ${showComments ? "text-primary" : "hover:text-foreground"}`}>
              <Icon icon={MessageSquare} size={16} />{comments.length || report.commentCount}
            </button>
          </div>
        </GlassCard>

        {showComments && (
          <GlassCard level={2} className="p-6">
            <h3 className="font-semibold text-foreground mb-4">评论 ({comments.length || report.commentCount})</h3>
            <div className="flex gap-2 mb-6">
              <input
                className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/30"
                placeholder="写下你的评论..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSendComment()}
              />
              <Button onClick={handleSendComment} disabled={sending || !commentText.trim()}>
                <Icon icon={sending ? Loader2 : Send} size={16} className={sending ? "animate-spin" : ""} />
              </Button>
            </div>
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">暂无评论</p>
            ) : (
              <div className="space-y-4">
                {comments.map((c: any) => (
                  <div key={c.id} className="flex gap-3">
                    <Avatar src={c.user?.avatar} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{c.user?.username}</span>
                        <span className="text-xs text-muted-foreground">{formatDateTime(c.createdAt)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        )}
      </div>
    </div>
  )
}
