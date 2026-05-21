"use client"
import { useState, useCallback } from "react"

export function usePagination(initialPage = 1, initialPageSize = 20) {
  const [page, setPage] = useState(initialPage)
  const [pageSize] = useState(initialPageSize)

  const goToPage = useCallback((p: number) => setPage(p), [])
  const nextPage = useCallback(() => setPage((p) => p + 1), [])
  const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), [])
  const reset = useCallback(() => setPage(1), [])

  return { page, pageSize, goToPage, nextPage, prevPage, reset }
}