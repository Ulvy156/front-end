import type { Role } from '~/types/role'

export interface UserPhone {
  phoneNumber: string
  type: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  imgUrl: string | null
  role: Role
  isVerified: boolean
  isLocked: boolean
  createdAt: string
  updatedAt: string
  phones: UserPhone[]
}
