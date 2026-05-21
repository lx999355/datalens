import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"
import { PAGE_SIZES } from "@/shared/lib/constants"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  if ((session.user as any).role !== "super_admin" && (session.user as any).role !== "sub_admin") return NextResponse.json({ error: { code: "FORBIDDEN", message: "无权限" } }, { status: 403 })

  const page = parseInt(request.nextUrl.searchParams.get("page") || "1")
  const status = request.nextUrl.searchParams.get("status")

  const where: Record<string, unknown> = { ...(status && { status }) }
  const [items, total] = await Promise.all([
    prisma.userSubscription.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZES.adminUsers, take: PAGE_SIZES.adminUsers, include: { user: { select: { username: true, email: true } }, plan: true } }),
    prisma.userSubscription.count({ where }),
  ])

  return NextResponse.json({ data: { items, total, page, pageSize: PAGE_SIZES.adminUsers, totalPages: Math.ceil(total / PAGE_SIZES.adminUsers) } })
}
