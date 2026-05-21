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
import { Upload, ImagePlus } from "lucide-react"
import { MagneticButton } from "@/shared/ui/MagneticButton"

export default function UploadChartPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [form, setForm] = useState({ title: "", description: "", visibility: "public" })
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(f)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !form.title) { addToast("warning", "请填写必要信息"); return }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", form.title)
      formData.append("description", form.description)
      formData.append("type", "image")
      formData.append("visibility", form.visibility)

      const res = await fetch("/api/charts", { method: "POST", body: formData })
      if (!res.ok) throw new Error("上传失败")
      addToast("success", "图表上传成功")
      router.push("/dashboard/charts")
    } catch { addToast("error", "上传失败") }
    finally { setIsUploading(false) }
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">上传图表</h1>
      <GlassCard level={2} className="p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div
            className="border-2 border-dashed border-white/[0.1] rounded-2xl p-8 text-center cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="预览" className="max-h-48 mx-auto rounded-xl" />
            ) : (
              <>
                <Icon icon={ImagePlus} size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">点击选择图表图片 (PNG/JPG/SVG, 最大20MB)</p>
              </>
            )}
            <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} accept=".png,.jpg,.jpeg,.svg" />
          </div>
          <Input label="标题" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Textarea label="描述" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
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
