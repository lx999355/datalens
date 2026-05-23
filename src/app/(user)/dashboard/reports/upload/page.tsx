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
import { Upload, FileUp, X } from "lucide-react"
import { MagneticButton } from "@/shared/ui/MagneticButton"

export default function UploadReportPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [form, setForm] = useState({ title: "", description: "", type: "finished", visibility: "public" })
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    if (selected.length === 0) return
    setFiles((prev) => [...prev, ...selected])
    if (fileRef.current) fileRef.current.value = ""
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) { addToast("warning", "请选择文件"); return }
    if (!form.title) { addToast("warning", "请输入标题"); return }

    setIsUploading(true)
    try {
      let success = 0
      for (const file of files) {
        const fd = new FormData()
        fd.append("file", file)
        fd.append("title", files.length === 1 ? form.title : `${form.title} (${success + 1})`)
        fd.append("description", form.description)
        fd.append("type", form.type)
        fd.append("visibility", form.visibility)
        const res = await fetch("/api/reports", { method: "POST", body: fd })
        if (res.ok) success++
      }
      addToast("success", `${success} 个文件上传成功`)
      router.push("/dashboard/reports")
    } catch {
      addToast("error", "上传失败")
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
            {files.length > 0 ? (
              <div className="space-y-1">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-center gap-2 text-sm text-foreground">
                    <span className="truncate max-w-xs">{f.name}</span>
                    <button type="button" className="text-muted-foreground hover:text-danger" onClick={(ev) => { ev.stopPropagation(); removeFile(i) }}>
                      <Icon icon={X} size={14} />
                    </button>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground mt-2">点击继续添加文件</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">点击选择文件 (PDF/Word/Excel/CSV, 可多选, 单文件最大50MB)</p>
            )}
            <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv" multiple />
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
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "上传中..." : `上传 (${files.length} 个文件)`}
              </Button>
            </MagneticButton>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}
