import { NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  }

  const userId = (session.user as any).id as string

  const [reportsCount, chartsCount, ordersCount, activeSub] = await Promise.all([
    prisma.report.count({ where: { userId } }),
    prisma.chart.count({ where: { userId } }),
    prisma.order.count({ where: { userId } }),
    prisma.userSubscription.findFirst({
      where: { userId, status: "active" },
      select: { customReportRemaining: true },
    }),
  ])

  return NextResponse.json({
    data: {
      reportsCount,
      chartsCount,
      ordersCount,
      remainingCustom: activeSub?.customReportRemaining || 0,
    },
  })
}