"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/shared/hooks/useAuth"
import { ShimmerSkeleton } from "@/shared/ui/ShimmerSkeleton"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [showChildren, setShowChildren] = useState(false)

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", window.location.origin)
      loginUrl.searchParams.set("callbackUrl", pathname)
      router.replace(loginUrl.toString())
    } else {
      setShowChildren(true)
    }
  }, [isLoading, isAuthenticated, router, pathname])

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <div className="hidden lg:block w-64" />
        <div className="flex-1 p-6 lg:p-8 space-y-6">
          <ShimmerSkeleton variant="card" className="h-12 w-48" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <ShimmerSkeleton key={i} variant="card" className="h-32" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null
  return <>{children}</>
}
