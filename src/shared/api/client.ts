type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
}

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options

  const res = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error?.message || `请求失败 (${res.status})`)
  }

  return json.data as T
}

export const apiClient = {
  get: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "GET" }),

  post: <T>(url: string, body?: unknown, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "POST", body }),

  put: <T>(url: string, body?: unknown, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "PUT", body }),

  delete: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "DELETE" }),
}

export async function uploadFile(url: string, formData: FormData): Promise<string> {
  const res = await fetch(url, { method: "POST", body: formData })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error?.message || "上传失败")
  return json.data.url
}