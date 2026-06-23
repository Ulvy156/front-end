export interface LandlordStats {
  totalProperties: number
  published: number
  unpublished: number
  available: number
  unavailable: number
  totalViews: number
  totalFavourites: number
  propertiesThisMonth: number
  monthlyLimit: number
  propertiesRemaining: number
}

export interface LandlordRecentActivity {
  id: string
  createdAt: string
  user: { id: string; name: string; imgUrl: string }
  property: {
    id: string
    title: string
    images: { imageKey: string }[]
  }
}

export interface LandlordTopProperty {
  id: string
  title: string
  totalViews: number
  isPublished: boolean
  isAvailable: boolean
  favouriteCount: number
  images: { imageKey: string }[]
}

export interface LandlordDashboardData {
  stats: LandlordStats
  recentActivity: LandlordRecentActivity[]
  topProperties: LandlordTopProperty[]
}
