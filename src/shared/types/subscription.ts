export interface SubscriptionPlanDTO {
  id: string
  name: string
  type: string
  price: number
  customReportCount: number
  isActive: boolean
}

export interface UserSubscriptionDTO {
  id: string
  userId: string
  planId: string
  plan?: SubscriptionPlanDTO
  status: string
  startDate: string | null
  endDate: string | null
  customReportRemaining: number
  createdAt: string
}