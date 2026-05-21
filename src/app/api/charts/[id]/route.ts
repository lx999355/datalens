import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const userId = session?.user ? (session.user as any).id as string : null

  const chart = await prisma.chart.findUnique({
    where: { id },
    include: { user: { select: { username: true, avatar: true } } },
  })
  if (!chart) return NextResponse.json({ error: { code: "NOT_FOUND", message: "图表不存在" } }, { status: 404 })

  if (chart.visibility === "private" && chart.userId !== userId) {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "无权限查看" } }, { status: 403 })
  }

  await prisma.chart.update({ where: { id }, data: { viewCount: { increment: 1 } } })

  const [likeCount, commentCount, hasLiked] = userId
    ? await Promise.all([
        prisma.like.count({ where: { chartId: id } }),
        prisma.comment.count({ where: { chartId: id, isActive: true } }),
        prisma.like.findFirst({ where: { chartId: id, userId } }),
      ])
    : [0, 0, false]

  return NextResponse.json({ data: { ...chart, likeCount, commentCount, hasLiked: !!hasLiked } })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })

  const userId = (session.user as any).id as string
  const chart = await prisma.chart.findUnique({ where: { id } })
  if (!chart) return NextResponse.json({ error: { code: "NOT_FOUND", message: "图表不存在" } }, { status: 404 })
  if (chart.userId !== userId) return NextResponse.json({ error: { code: "FORBIDDEN", message: "无权限" } }, { status: 403 })

  const body = await request.json()
  const updated = await prisma.chart.update({
    where: { id },
    data: {
      ...(body.title && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.visibility && { visibility: body.visibility }),
      ...(body.tags !== undefined && { tags: body.tags }),
    },
  })
  return NextResponse.json({ data: updated })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })

  const userId = (session.user as any).id as string
  const role = (session.user as any).role as string
  const chart = await prisma.chart.findUnique({ where: { id } })
  if (!chart) return NextResponse.json({ error: { code: "NOT_FOUND", message: "图表不存在" } }, { status: 404 })
  if (chart.userId !== userId && role !== "super_admin" && role !== "sub_admin") {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "无权限" } }, { status: 403 })
  }

  await prisma.chart.delete({ where: { id } })
  return NextResponse.json({ data: { success: true } })
}
