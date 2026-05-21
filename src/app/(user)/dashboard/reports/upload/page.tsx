"use client"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Button } from "@/shared/ui/Button"
import { Input } from "@/shared/ui/Input"
import { Textarea } from "@/shared/ui/Textarea"
import { Select } from "@/shared/ui/Select"
import { Icon } from "@/shared/ui/Icon"
import { useToast } from "@/shared/ui/Toast"
import { Upload, FileUp } from "lucide-react"
import { MagneticButton } from "@/shared/ui/MagneticButton"

export default function UploadReportPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [form, setForm] = useState({ title: "", description: "", type: "finished", visibility: "public" })
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) { addToast("warning", "请选择文件"); return }
    if (!form.title) { addToast("warning", "请输入标题"); return }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", form.title)
      formData.append("description", form.description)
      formData.append("type", form.type)
      formData.append("visibility", form.visibility)

      const res = await fetch("/api/reports", { method: "POST", body: formData })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error?.message || "上传失败")
      }
      addToast("success", "报告上传成功")
      router.push("/dashboard/reports")
      router.refresh()
    } catch (err: any) {
      addToast("error", err.message || "上传失败")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">上传报告</h1>
      <GlassCard level={2} className="p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div
            className="border-2 border-dashed border-white/[0.1] rounded-2xl p-8 text-center cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            <Icon icon={FileUp} size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {file ? file.name : "点击选择文件 (PDF/Word/Excel/CSV, 最大50MB)"}
            </p>
            <input ref={fileRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv" />
          </div>
          <Input label="标题" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="输入报告标题" />
          <Textarea label="描述" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="描述报告内容" />
          <Select label="类型" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
            options={[{ value: "finished", label: "成品报告" }, { value: "source_data", label: "源数据" }]} />
          <Select label="可见性" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}
            options={[{ value: "public", label: "公开" }, { value: "private", label: "私密" }]} />
          <div className="flex gap-3 justify-end">
            <MagneticButton maxOffset={6}>
              <Button variant="secondary" type="button" onClick={() => router.back()}>取消</Button>
            </MagneticButton>
            <MagneticButton maxOffset={6}>
              <Button type="submit" disabled={isUploading}>{isUploading ? "上传中..." : "上传"}</Button>
            </MagneticButton>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}
