export interface NotificationDTO {
  id: string
  userId: string
  type: string
  content: string
  link: string | null
  isRead: boolean
  createdAt: string
}