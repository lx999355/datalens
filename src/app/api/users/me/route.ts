import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"

export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  const userId = (session.user as any).id as string
  const body = await request.json()
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { ...(body.bio !== undefined && { bio: body.bio }), ...(body.avatar !== undefined && { avatar: body.avatar }) },
    select: { id: true, username: true, email: true, bio: true, avatar: true, role: true },
  })
  return NextResponse.json({ data: updated })
}
