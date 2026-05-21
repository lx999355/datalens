import { NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  const userId = (session.user as any).id as string
  const count = await prisma.notification.count({ where: { userId, isRead: false } })
  return NextResponse.json({ data: { count } })
}
