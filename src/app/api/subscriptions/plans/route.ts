import { NextResponse } from "next/server"
import { prisma } from "@/shared/lib/prisma"

export async function GET() {
  const plans = await prisma.subscriptionPlan.findMany({ where: { isActive: true }, orderBy: { price: "asc" } })
  return NextResponse.json({ data: plans })
}
