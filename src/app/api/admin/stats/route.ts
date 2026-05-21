import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  const role = (session.user as any).role
  if (role !== "super_admin" && role !== "sub_admin") return NextResponse.json({ error: { code: "FORBIDDEN", message: "无权限" } }, { status: 403 })

  const range = request.nextUrl.searchParams.get("range") || "today"
  const now = new Date()
  let startDate = new Date(0)
  if (range === "today") { startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()) }
  else if (range === "week") { startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
  else if (range === "month") { startDate = new Date(now.getFullYear(), now.getMonth(), 1) }

  const [usersCount, newUsersCount, ordersCount, pendingOrders, todayRevenue, reportsCount, chartsCount, activeSubscriptions] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startDate } } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "pending_payment" } }),
    prisma.order.aggregate({ _sum: { amount: true }, where: { status: "confirmed", createdAt: { gte: startDate } } }),
    prisma.report.count(),
    prisma.chart.count(),
    prisma.userSubscription.count({ where: { status: "active" } }),
  ])

  return NextResponse.json({
    data: {
      usersCount, newUsersCount, ordersCount, pendingOrders,
      todayRevenue: todayRevenue._sum.amount || 0,
      reportsCount, chartsCount, activeSubscriptions,
    },
  })
}
