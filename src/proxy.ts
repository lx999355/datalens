import { auth } from "@/shared/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const token = req.auth

  // ========== Admin 路由保护 ==========
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: { code: "UNAUTHORIZED", message: "请先登录" } },
          { status: 401 }
        )
      }
      const loginUrl = new URL("/login", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    const role = (token?.user as Record<string, unknown>)?.role as string
    if (role !== "super_admin" && role !== "sub_admin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: { code: "FORBIDDEN", message: "无权限" } },
          { status: 403 }
        )
      }
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // 仅超级管理员可访问设置页
    if (pathname.startsWith("/admin/settings") || pathname.startsWith("/api/admin/settings")) {
      if (role !== "super_admin") {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { error: { code: "FORBIDDEN", message: "仅超级管理员可操作" } },
            { status: 403 }
          )
        }
        return NextResponse.redirect(new URL("/admin", req.url))
      }
    }
  }

  // ========== 公开 API（无需认证） ==========
  const publicApiPaths = [
    "/api/subscriptions/plans",
    "/api/auth/check-username",
    "/api/auth/signup",
  ]
  const isPublicApi = publicApiPaths.some((p) => pathname.startsWith(p))

  // 公开内容路由：GET 请求不需要认证
  const isPublicContent =
    (pathname.startsWith("/api/reports") ||
      pathname.startsWith("/api/charts") ||
      pathname.match(/^\/api\/users\/[^/]+$/)) &&
    req.method === "GET"

  // NextAuth 路由直接放行
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next()
  }

  // ========== 用户路由保护 ==========
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
      const loginUrl = new URL("/login", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/dashboard/:path*",
    "/api/:path*",
  ],
}
