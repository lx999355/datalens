import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"
import { PAGE_SIZES } from "@/shared/lib/constants"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1")

  const [items, total] = await Promise.all([
    prisma.comment.findMany({
      where: { chartId: id, isActive: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZES.comments,
      take: PAGE_SIZES.comments,
      include: { user: { select: { username: true, avatar: true } } },
    }),
    prisma.comment.count({
      where: { chartId: id, isActive: true },
    }),
  ])

  return NextResponse.json({
    data: {
      items,
      total,
      page,
      pageSize: PAGE_SIZES.comments,
      totalPages: Math.ceil(total / PAGE_SIZES.comments),
    },
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "请先登录" } },
      { status: 401 }
    )
  }
  const userId = (session.user as any).id as string
  const { content } = await request.json()

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "评论内容不能为空" } },
      { status: 400 }
    )
  }
  if (content.length > 1000) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "评论最多1000个字符" } },
      { status: 400 }
    )
  }

  const chart = await prisma.chart.findUnique({
    where: { id },
    select: { userId: true, title: true },
  })
  if (!chart) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "图表不存在" } },
      { status: 404 }
    )
  }

  const comment = await prisma.comment.create({
    data: { userId, chartId: id, content: content.trim() },
    include: { user: { select: { username: true, avatar: true } } },
  })

  if (chart.userId !== userId) {
    await prisma.notification.create({
      data: {
        userId: chart.userId,
        type: "new_comment",
        content: `${(session.user as any).username || session.user.name}评论了你的图表[${chart.title}]`,
        link: `/charts/${id}`,
      },
    })
  }

  return NextResponse.json({ data: comment }, { status: 201 })
}
