import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "请先登录" } },
      { status: 401 }
    )
  }
  const followerId = (session.user as any).id as string

  // 通过 username 查找用户
  const targetUser = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true },
  })
  if (!targetUser) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "用户不存在" } },
      { status: 404 }
    )
  }

  if (followerId === targetUser.id) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "不能关注自己" } },
      { status: 400 }
    )
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId: targetUser.id,
      },
    },
  })

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } })
    return NextResponse.json({ data: { isFollowing: false } })
  }

  await prisma.follow.create({
    data: { followerId, followingId: targetUser.id },
  })

  await prisma.notification.create({
    data: {
      userId: targetUser.id,
      type: "new_follow",
      content: `${(session.user as any).username || session.user.name}关注了你`,
      link: `/users/${(session.user as any).username}`,
    },
  })

  return NextResponse.json({ data: { isFollowing: true } })
}
