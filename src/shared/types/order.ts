export interface OrderDTO {
  id: string
  userId: string
  user?: { username: string; avatar: string | null }
  type: string
  status: string
  amount: number
  requirement: string | null
  attachments: string | null
  deliverUrl: string | null
  deliverFileName: string | null
  deliverFileType: string | null
  deliverFileSize: number | null
  adminNote: string | null
  createdAt: string
  updatedAt: string
}

export interface OrderCreateDTO {
  type: string
  amount: number
  requirement?: string
  attachments?: string[]
}