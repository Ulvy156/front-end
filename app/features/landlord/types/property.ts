import type { ParkingType } from '~/features/property-details/interface/properties-details'

export interface LandlordPropertyReport {
  id: string | number
  description: string
  createdAt: string
  user?: { id: string; name: string; imgUrl: string }
}

export interface LandlordPropertyDetail {
  id: string
  userId: string
  title: string
  description: string
  monthly_price: number
  deposit: number
  bedroom: number
  bathroom: number
  floor: number
  totalFloors: number
  sizeSqm: number
  furnished: boolean
  address: string
  lat: number | null
  lng: number | null
  nearby_location: string | null
  isPublished: boolean
  isAvailable: boolean
  isFeatured: boolean
  featuredAt: string | null
  totalViews: number
  minimumStayLength: number
  availableFrom: string
  openTime: string | null
  closeTime: string | null
  createdAt: string
  updatedAt: string
  images: { id: string; imageKey: string; isCover: boolean }[]
  propertyType: { nameEn: string; nameKh: string; icon: string }
  district: {
    nameEn: string
    nameKh: string
    province: { nameEn: string; nameKh: string }
  }
  parkings: { id: string; type: ParkingType; slots: number; isFree: boolean; price: number | null; note: string | null }[]
  amenities: { id: number; nameEn: string; nameKh: string; icon: string }[]
  rules: { nameEn: string; nameKh: string; icon: string; is_allow: boolean }[]
  propertyReport: LandlordPropertyReport[]
  favouriteCount: number
  reportCount: number
}

export interface LandlordProperty {
  id: string
  title: string
  monthly_price: number
  isPublished: boolean
  isAvailable: boolean
  isFeatured: boolean
  totalViews: number
  favouriteCount: number
  reportCount: number
  propertyReport: LandlordPropertyReport[]
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
