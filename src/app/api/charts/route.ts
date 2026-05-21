import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"
import { PAGE_SIZES } from "@/shared/lib/constants"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })

  const userId = (session.user as any).id as string
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = PAGE_SIZES.charts
  const type = searchParams.get("type")
  const visibility = searchParams.get("visibility")
  const search = searchParams.get("search")

  const where: Record<string, unknown> = {
    userId,
    ...(type && { type }),
    ...(visibility && { visibility }),
    ...(search && { title: { contains: search, mode: "insensitive" } }),
  }

  const [items, total] = await Promise.all([
    prisma.chart.findMany({
      where, orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize, take: pageSize,
      include: { user: { select: { username: true, avatar: true } } },
    }),
    prisma.chart.count({ where }),
  ])

  const enrichedItems = await Promise.all(
    items.map(async (chart: { id: string; [key: string]: unknown }) => {
      const [likeCount, commentCount, hasLiked] = await Promise.all([
        prisma.like.count({ where: { chartId: chart.id } }),
        prisma.comment.count({ where: { chartId: chart.id, isActive: true } }),
        prisma.like.findFirst({ where: { chartId: chart.id, userId } }),
      ])
      return { ...chart, likeCount, commentCount, hasLiked: !!hasLiked }
    })
  )

  return NextResponse.json({
    data: { items: enrichedItems, total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })

  const userId = (session.user as any).id as string
  const formData = await request.formData()
  const file = formData.get("file") as File
  const title = formData.get("title") as string
  const description = (formData.get("description") as string) || null
  const type = formData.get("type") as string
  const chartType = (formData.get("chartType") as string) || null
  const visibility = (formData.get("visibility") as string) || "public"
  const chartConfig = formData.get("chartConfig") as string | null
  const sourceDataUrl = (formData.get("sourceDataUrl") as string) || null
  const tags = (formData.get("tags") as string) || null

  if (!file || !title || !type) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "缺少必填字段" } }, { status: 400 })
  }

  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: { code: "PAYLOAD_TOO_LARGE", message: "文件大小不能超过20MB" } }, { status: 413 })
  }

  const { uploadToCOS } = await import("@/shared/lib/cos")
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = file.name.split(".").pop()
  const key = `charts/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const fileUrl = await uploadToCOS(key, buffer, file.type)

  const chart = await prisma.chart.create({
    data: {
      userId, title, description, type, chartType, visibility, fileUrl, sourceDataUrl,
      chartConfig: chartConfig ? JSON.parse(chartConfig) : null, tags,
    },
  })

  return NextResponse.json({ data: chart }, { status: 201 })
}
