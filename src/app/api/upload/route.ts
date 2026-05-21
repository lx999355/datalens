export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return Response.json(
        { error: { code: "VALIDATION_ERROR", message: "请选择文件" } },
        { status: 400 }
      )
    }

    const { uploadToCOS } = await import("@/shared/lib/cos")
    const directory = (formData.get("directory") as string) || "misc"
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = file.name.split(".").pop()
    const key = `${directory}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const url = await uploadToCOS(key, buffer, file.type)

    return Response.json({
      data: { url, key, fileName: file.name, fileSize: file.size, fileType: file.type },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "上传失败" } },
      { status: 500 }
    )
  }
}