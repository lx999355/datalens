import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const session = await auth()
  const currentUserId = session?.user ? (session.user as any).id as string : null

  const user = await prisma.user.findUnique({
    where: { username, isActive: true },
    select: { id: true, username: true, bio: true, avatar: true, createdAt: true },
  })
  if (!user) return NextResponse.json({ error: { code: "NOT_FOUND", message: "用户不存在" } }, { status: 404 })

  const [reportsCount, chartsCount, followersCount, followingCount, isFollowing] = await Promise.all([
    prisma.report.count({ where: { userId: user.id, visibility: "public", isActive: true } }),
    prisma.chart.count({ where: { userId: user.id, visibility: "public", isActive: true } }),
    prisma.follow.count({ where: { followingId: user.id } }),
    prisma.follow.count({ where: { followerId: user.id } }),
    currentUserId ? prisma.follow.findFirst({ where: { followerId: currentUserId, followingId: user.id } }) : null,
  ])

  return NextResponse.json({
    data: { ...user, reportsCount, chartsCount, followersCount, followingCount, isFollowing: !!isFollowing },
  })
}
