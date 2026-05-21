import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"
import { PAGE_SIZES } from "@/shared/lib/constants"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  if ((session.user as any).role !== "super_admin" && (session.user as any).role !== "sub_admin") return NextResponse.json({ error: { code: "FORBIDDEN", message: "无权限" } }, { status: 403 })

  const page = parseInt(request.nextUrl.searchParams.get("page") || "1")
  const search = request.nextUrl.searchParams.get("search")
  const isActive = request.nextUrl.searchParams.get("isActive")

  const where: Record<string, unknown> = {
    ...(search && { title: { contains: search, mode: "insensitive" } }),
    ...(isActive !== null && isActive !== "" && { isActive: isActive === "true" }),
  }

  const [items, total] = await Promise.all([
    prisma.chart.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZES.charts, take: PAGE_SIZES.charts, include: { user: { select: { username: true } } } }),
    prisma.chart.count({ where }),
  ])

  return NextResponse.json({ data: { items, total, page, pageSize: PAGE_SIZES.charts, totalPages: Math.ceil(total / PAGE_SIZES.charts) } })
}
