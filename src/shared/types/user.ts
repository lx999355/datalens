export interface UserDTO {
  id: string
  username: string
  email: string
  role: string
  bio: string | null
  avatar: string | null
  isActive: boolean
  createdAt: string
}

export interface PublicUserDTO {
  id: string
  username: string
  bio: string | null
  avatar: string | null
  reportsCount: number
  chartsCount: number
  followersCount: number
  followingCount: number
  isFollowing: boolean
  createdAt: string
}

export interface UpdateProfileDTO {
  bio?: string
  avatar?: string
}

export interface ChangePasswordDTO {
  currentPassword: string
  newPassword: string
}