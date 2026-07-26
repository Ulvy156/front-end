import type { Role } from '~/types/role'

export interface AdminUser {
  id: string
  name: string
  email: string
  imgUrl: string | null
  role: Role
  isVerified: boolean
  hasVerifiedBadge: boolean
  isLocked: boolean
  createdAt: string
  updatedAt: string
}

export interface UserListMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface UserListResponse {
  items: AdminUser[]
  meta: UserListMeta
}

export interface CreateUserPayload {
  name: string
  email: string
  password: string
  role: Role
}

export interface UpdateUserPayload {
  id: string
  name: string
  role: Role
}
