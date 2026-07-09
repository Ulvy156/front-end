export interface AdminProperty {
  id: string
  title: string
  monthly_price: number
  isPublished: boolean
  isAvailable: boolean
  isFeatured: boolean
  totalViews: number
  favouriteCount: number
  reportCount: number
  createdAt: string
  updatedAt: string
  user: { id: string; name: string; email: string }
  images: { imageKey: string }[]
  district: {
    nameEn: string
    nameKh: string
    province: { nameEn: string; nameKh: string }
  }
  propertyType: { nameEn: string; nameKh: string; icon: string }
}

export interface AdminPropertiesResponse {
  items: AdminProperty[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface AdminPropertiesFilter {
  page: number
  limit: number
  search?: string
  isPublished?: boolean
  isFeatured?: boolean
  isAvailable?: boolean
  landlordId?: string
  propertyId?: string
}

export interface AdminPropertyDetail {
  id: string
  title: string
  description: string
  address: string
  monthly_price: number
  deposit: number
  bedroom: number
  bathroom: number
  floor: number
  totalFloors: number
  sizeSqm: number
  furnished: boolean
  isPublished: boolean
  isAvailable: boolean
  isFeatured: boolean
  featuredAt: string | null
  totalViews: number
  minimumStayLength: number
  lat: number
  lng: number
  nearby_location: string
  availableFrom: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    imgUrl: string | null
    role: string
    isVerified: boolean
    isLocked: boolean
    createdAt: string
    phones: { phoneNumber: string; type: string }[]
  }
  images: { id: number; imageKey: string; isCover: boolean; createdAt: string }[]
  propertyType: { nameEn: string; nameKh: string; icon: string }
  amenities: { nameEn: string; nameKh: string; icon: string }[]
  district: {
    nameEn: string
    nameKh: string
    province: { nameEn: string; nameKh: string }
  }
  rules: { nameEn: string; nameKh: string; icon: string; is_allow: boolean }[]
  parkings: { id: number; type: string; slots: number; isFree: boolean; price: number; note: string | null }[]
  propertyViews: { date: string; views: number }[]
  propertyReport: {
    id: number
    description: string
    createdAt: string
    user: { id: string; name: string; email: string }
  }[]
  favouriteCount: number
}
