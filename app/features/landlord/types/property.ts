export interface LandlordProperty {
  id: string
  title: string
  monthly_price: number
  isPublished: boolean
  isAvailable: boolean
  isFeatured: boolean
  totalViews: number
  favouriteCount: number
  createdAt: string
  images: { imageKey: string }[]
  district: {
    nameEn: string
    nameKh: string
    province: { nameEn: string; nameKh: string }
  }
  propertyType: { nameEn: string; nameKh: string; icon: string }
}

export interface LandlordPropertiesResponse {
  items: LandlordProperty[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface LandlordPropertiesFilter {
  page: number
  limit: number
  search?: string
  isPublished?: boolean
  isAvailable?: boolean
}
