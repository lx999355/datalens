export interface ReportDTO {
  id: string
  userId: string
  user?: { username: string; avatar: string | null }
  title: string
  description: string | null
  type: string
  visibility: string
  fileUrl: string
  fileSize: number | null
  fileType: string | null
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

export interface ReportCreateDTO {
  title: string
  description?: string
  type: string
  visibility: string
  tags?: string
}