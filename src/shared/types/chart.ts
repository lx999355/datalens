export interface ChartDTO {
  id: string
  userId: string
  user?: { username: string; avatar: string | null }
  title: string
  description: string | null
  type: string
  chartType: string | null
  visibility: string
  fileUrl: string
  sourceDataUrl: string | null
  chartConfig: Record<string, unknown> | null
  tags: string | null
  isActive: boolean
  viewCount: number
  downloadCount: number
  likeCount: number
  commentCount: number
  hasLiked: boolean
  createdAt: string
  updatedAt: string
}

export interface ChartCreateDTO {
  title: string
  description?: string
  type: string
  chartType?: string
  visibility: string
  chartConfig?: Record<string, unknown>
  tags?: string
}