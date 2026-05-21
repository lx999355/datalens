"use client"
import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFetch } from "@/shared/hooks/useFetch"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Button } from "@/shared/ui/Button"
import { Input } from "@/shared/ui/Input"
import { Textarea } from "@/shared/ui/Textarea"
import { Select } from "@/shared/ui/Select"
import { Icon } from "@/shared/ui/Icon"
import { useToast } from "@/shared/ui/Toast"
import { ShimmerSkeleton } from "@/shared/ui/ShimmerSkeleton"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { addToast } = useToast()
  const { data: report, isLoading } = useFetch<any>(`/api/reports/${id}`)
  const [form, setForm] = useState({ title: "", description: "", visibility: "public" })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (report) {
      setForm({ title: report.title, description: report.description || "", visibility: report.visibility })
    }
  }, [report])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      addToast("success", "报告已更新")
      router.push("/dashboard/reports")
    } catch { addToast("error", "更新失败") }
    finally { setIsSaving(false) }
  }

  if (isLoading) return <div className="p-6 lg:p-8"><ShimmerSkeleton variant="card" className="h-64" /></div>

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <Link href="/dashboard/reports" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <Icon icon={ArrowLeft} size={16} />返回
      </Link>
      <h1 className="text-2xl font-bold text-foreground mb-6">编辑报告</h1>
      <GlassCard level={2} className="p-8">
        <form onSubmit={handleSave} className="space-y-5">
          <Input label="标题" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Textarea label="描述" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          <Select label="可见性" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}
            options={[{ value: "public", label: "公开" }, { value: "private", label: "私密" }]} />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" type="button" onClick={() => router.back()}>取消</Button>
            <Button type="submit" disabled={isSaving}><Icon icon={Save} size={16} />{isSaving ? "保存中..." : "保存"}</Button>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}