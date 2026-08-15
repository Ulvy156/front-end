import type { Role } from '~/types/role'

export interface UserPhone {
  id: number
  phoneNumber: string
  type: string
}

export interface NewPhone {
  id: number
  phoneNumber: string
  type: string
  createdAt: string
}

export interface ContactVisibility {
  showPhone: boolean
  showTelegram: boolean
  showEmail: boolean
}

export interface UserProfile {
  id: string
  name: string
  email: string
  imgUrl: string | null
  role: Role
  isVerified: boolean
  isLocked: boolean
  hasVerifiedBadge: boolean
  createdAt: string
  updatedAt: string
  phones: UserPhone[]
  showPhone: boolean
  showTelegram: boolean
  showEmail: boolean
  hasPassword: boolean
  deletionRequestedAt: string | null
  deletionScheduledFor: string | null
}

export interface DeletionRequestResult extends UserProfile {
  message: string
}
