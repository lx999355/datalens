export const FILE_SIZE_LIMITS = {
  report: 50 * 1024 * 1024, // 50MB
  chart: 20 * 1024 * 1024, // 20MB
  avatar: 5 * 1024 * 1024, // 5MB
  orderAttachment: 20 * 1024 * 1024, // 20MB
  csvMax: 10 * 1024 * 1024, // 10MB for CSV
  csvMaxRows: 100000,
}

export const MIME_WHITELIST = {
  report: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ],
  chart: ["image/png", "image/jpeg", "image/svg+xml"],
  avatar: ["image/png", "image/jpeg", "image/webp"],
  csv: ["text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
}

export const PAGE_SIZES = {
  reports: 20,
  charts: 20,
  orders: 10,
  notifications: 20,
  users: 20,
  comments: 20,
  adminUsers: 20,
}

export const RATE_LIMITS = {
  login: { max: 10, windowMs: 60 * 1000 }, // 10 requests per minute
  upload: { max: 20, windowMs: 60 * 60 * 1000 }, // 20 per hour
}

export const DOWNLOAD_LIMIT = {
  freePerDay: 3,
}

export const PAYMENT_TIMEOUT_MS = 15 * 60 * 1000 // 15 minutes

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "请先登录",
  FORBIDDEN: "无权限",
  NOT_FOUND: "资源不存在",
  VALIDATION_ERROR: "请求参数错误",
  RATE_LIMIT: "请求过于频繁，请稍后重试",
  PAYLOAD_TOO_LARGE: "文件大小超出限制",
  INTERNAL_ERROR: "服务器内部错误",
  DOWNLOAD_LIMIT_REACHED: "今日免费下载次数已用完，请升级订阅",
  FILE_TYPE_NOT_ALLOWED: "不支持的文件类型",
}