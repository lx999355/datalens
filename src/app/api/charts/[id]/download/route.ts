import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"
import { DOWNLOAD_LIMIT } from "@/shared/lib/constants"

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

  const chart = await prisma.chart.findUnique({
    where: { id },
    select: { fileUrl: true, userId: true, title: true },
  })
  if (!chart) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "图表不存在" } },
      { status: 404 }
    )
  }

  const activeSub = await prisma.userSubscription.findFirst({
    where: { userId, status: "active" },
  })

  if (!activeSub) {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const count = await prisma.downloadLog.count({
      where: {
        userId,
        targetType: "chart",
        createdAt: { gte: todayStart },
      },
    })
    if (count >= DOWNLOAD_LIMIT.freePerDay) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: `今日免费下载次数(${DOWNLOAD_LIMIT.freePerDay}次)已用完，请升级订阅`,
          },
        },
        { status: 403 }
      )
    }
  }

  await Promise.all([
    prisma.downloadLog.create({
      data: { userId, targetType: "chart", targetId: id },
    }),
    prisma.chart.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    }),
  ])

  return NextResponse.json({ data: { url: chart.fileUrl } })
}
