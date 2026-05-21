import { NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"

export async function POST() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  const userId = (session.user as any).id as string
  await prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } })
  return NextResponse.json({ data: { success: true } })
}
