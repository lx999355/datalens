"use client"
import { useSession } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()
  return {
    user: session?.user ? {
      id: (session.user as any).id as string,
      username: (session.user as any).username as string || session.user.name as string,
      email: session.user.email as string,
      role: (session.user as any).role as string,
      bio: (session.user as any).bio as string | null || null,
      avatar: (session.user as any).avatar as string | null || session.user.image as string | null || null,
    } : null,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isAdmin: (session?.user as any)?.role === "super_admin" || (session?.user as any)?.role === "sub_admin",
    isSuperAdmin: (session?.user as any)?.role === "super_admin",
  }
}