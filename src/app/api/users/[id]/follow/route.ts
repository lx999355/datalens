import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"

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
  const followerId = (session.user as any).id as string

  if (followerId === id) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "不能关注自己" } },
      { status: 400 }
    )
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId: id,
      },
    },
  })

  if (existing) {
    // Unfollow
    await prisma.follow.delete({
      where: { id: existing.id },
    })
    return NextResponse.json({ data: { isFollowing: false } })
  }

  // Follow
  await prisma.follow.create({
    data: { followerId, followingId: id },
  })

  // Create notification
  const targetUser = await prisma.user.findUnique({
    where: { id },
    select: { username: true },
  })
  if (targetUser) {
    await prisma.notification.create({
      data: {
        userId: id,
        type: "new_follow",
        content: `${(session.user as any).username || session.user.name}关注了你`,
        link: `/users/${(session.user as any).username}`,
      },
    })
  }

  return NextResponse.json({ data: { isFollowing: true } })
}
