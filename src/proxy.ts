import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "fallback-secret")

async function getTokenPayload(request: NextRequest) {
  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value

  if (!sessionToken) return null

  try {
    const { payload } = await jwtVerify(sessionToken, SECRET)
    return payload as Record<string, unknown>
  } catch {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getTokenPayload(request)

  // Admin routes protection
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: { code: "UNAUTHORIZED", message: "请先登录" } },
          { status: 401 }
        )
      }
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
    const role = token.role as string
    if (role !== "super_admin" && role !== "sub_admin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: { code: "FORBIDDEN", message: "无权限" } },
          { status: 403 }
        )
      }
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    // super_admin only routes
    if (pathname.startsWith("/admin/settings") || pathname.startsWith("/api/admin/settings")) {
      if (role !== "super_admin") {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { error: { code: "FORBIDDEN", message: "仅超级管理员可操作" } },
            { status: 403 }
          )
        }
        return NextResponse.redirect(new URL("/admin", request.url))
      }
    }
  }

  // Public API routes — no auth required
  const publicApiPaths = [
    "/api/subscriptions/plans",
    "/api/auth/check-username",
    "/api/auth/signup",
  ]
  const isPublicApi = publicApiPaths.some((p) => pathname.startsWith(p))
  // Public content routes: GET reports, charts, users without auth
  const isPublicContent =
    (pathname.startsWith("/api/reports/") || pathname.startsWith("/api/charts/") || pathname.match(/^\/api\/users\/[^/]+$/)) &&
    request.method === "GET"

  // Auth API routes are handled by NextAuth - let them through
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next()
  }

  // User routes protection (dashboard pages and non-public API routes)
  if (
    (pathname.startsWith("/dashboard") ||
      (pathname.startsWith("/api/") && !isPublicApi && !isPublicContent)) &&
    !pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/auth/")
  ) {
    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: { code: "UNAUTHORIZED", message: "请先登录" } },
          { status: 401 }
        )
      }
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/dashboard/:path*",
    "/api/:path*",
  ],
}
