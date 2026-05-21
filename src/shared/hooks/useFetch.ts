"use client"
import { useState, useEffect, useCallback } from "react"

interface UseFetchResult<T> {
  data: T | null
  error: string | null
  isLoading: boolean
  refetch: () => void
}

export function useFetch<T>(url: string | null): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [key, setKey] = useState(0)

  const refetch = useCallback(() => setKey((k) => k + 1), [])

  useEffect(() => {
    if (!url) return
    let cancelled = false
    setIsLoading(true)
    setError(null)

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`请求失败 (${res.status})`)
        return res.json()
      })
      .then((json) => {
        if (!cancelled) {
          if (json.error) {
            setError(json.error.message || "未知错误")
          } else {
            setData(json.data)
          }
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "网络连接失败")
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [url, key])

  return { data, error, isLoading, refetch }
}