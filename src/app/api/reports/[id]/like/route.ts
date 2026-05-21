import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"

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

  const report = await prisma.report.findUnique({
    where: { id },
    select: { userId: true, title: true },
  })
  if (!report) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "报告不存在" } },
      { status: 404 }
    )
  }

  const existing = await prisma.like.findUnique({
    where: { userId_reportId: { userId, reportId: id } },
  })

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
    return NextResponse.json({ data: { liked: false } })
  }

  await prisma.like.create({ data: { userId, reportId: id } })

  // Notify report owner
  if (report.userId !== userId) {
    await prisma.notification.create({
      data: {
        userId: report.userId,
        type: "new_like",
        content: `${(session.user as any).username || session.user.name}赞了你的报告[${report.title}]`,
        link: `/reports/${id}`,
      },
    })
  }

  return NextResponse.json({ data: { liked: true } })
}
