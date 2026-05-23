import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"
import { PAGE_SIZES } from "@/shared/lib/constants"

export async function GET(request: NextRequest) {
  const session = await auth()
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("pageSize") || "20")
  const type = searchParams.get("type")
  const search = searchParams.get("search")

  // 公开浏览：返回所有 public 的内容
  if (!session?.user) {
    const where: Record<string, unknown> = {
      visibility: "public",
      ...(type && type !== "all" && { type }),
      ...(search && { title: { contains: search, mode: "insensitive" } }),
    }
    const [items, total] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { user: { select: { username: true, avatar: true } } },
      }),
      prisma.report.count({ where }),
    ])
    return NextResponse.json({
      data: { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    })
  }

  // 登录用户：返回自己的内容
  const userId = (session.user as any).id as string
  const visibility = searchParams.get("visibility")

  const userWhere: Record<string, unknown> = {
    userId,
    ...(type && type !== "all" && { type }),
    ...(visibility && { visibility }),
    ...(search && { title: { contains: search, mode: "insensitive" } }),
  }

  const [items, total] = await Promise.all([
    prisma.report.findMany({
      where: userWhere,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { user: { select: { username: true, avatar: true } } },
    }),
    prisma.report.count({ where: userWhere }),
  ])

  const enrichedItems = await Promise.all(
    items.map(async (report: { id: string; [key: string]: unknown }) => {
      const [likeCount, commentCount, hasLiked] = await Promise.all([
        prisma.like.count({ where: { reportId: report.id } }),
        prisma.comment.count({ where: { reportId: report.id, isActive: true } }),
        prisma.like.findFirst({ where: { reportId: report.id, userId } }),
      ])
      return { ...report, likeCount, commentCount, hasLiked: !!hasLiked }
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
  const visibility = (formData.get("visibility") as string) || "public"
  const tags = (formData.get("tags") as string) || null

  if (!file || !title || !type) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "缺少必填字段" } }, { status: 400 })
  }

  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: { code: "PAYLOAD_TOO_LARGE", message: "文件大小不能超过50MB" } }, { status: 413 })
  }

  const { uploadToCOS } = await import("@/shared/lib/cos")
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = file.name.split(".").pop()
  const key = `reports/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const fileUrl = await uploadToCOS(key, buffer, file.type)

  const report = await prisma.report.create({
    data: {
      userId, title, description, type, visibility, fileUrl, fileSize: file.size,
      fileType: file.type, tags,
    },
  })

  return NextResponse.json({ data: report }, { status: 201 })
}
