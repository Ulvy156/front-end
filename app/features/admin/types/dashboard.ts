import type { Role } from '~/types/role'

export interface DashboardStats {
  users: {
    total: number
    locked: number
    unverified: number
    newThisMonth: number
  }
  landlords: {
    total: number
    newThisMonth: number
  }
  properties: {
    total: number
    published: number
    unpublished: number
    unavailable: number
    featured: number
    featuredMax: number
    newThisMonth: number
  }
  feedback: {
    total: number
    byType: {
      BUG: number
      SUGGESTION: number
      OTHER: number
    }
  }
}

export interface RecentRegistration {
  id: string
  name: string
  email: string
  role: Role
  isLocked: boolean
  createdAt: string
}

export interface LatestProperty {
  id: string
  title: string
  isPublished: boolean
  isFeatured: boolean
  createdAt: string
  user: { name: string; email: string }
  images: { imageKey: string }[]
}

export interface TopProperty {
  id: string
  title: string
  totalViews: number
  isAvailable: boolean
  favouriteCount: number
  images: { imageKey: string }[]
}

export interface RecentFeedbackItem {
  id: string
  type: 'BUG' | 'SUGGESTION' | 'OTHER'
  description: string
  createdAt: string
  user: { id: string; name: string }
}

export interface DashboardData {
  stats: DashboardStats
  recentRegistrations: RecentRegistration[]
  latestProperties: LatestProperty[]
  topProperties: TopProperty[]
  recentFeedback: RecentFeedbackItem[]
}
