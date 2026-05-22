export interface LandlordProfile {
  id: string
  name: string
  email: string
  imgUrl: string | null
  createdAt: string
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
  createdAt: string
  images: { imageKey: string }[]
  district: {
    nameEn: string
    nameKh: string
    province: { nameEn: string; nameKh: string }
  }
}

export interface LandlordPropertiesResponse {
  landlord: LandlordProfile
  properties: LandlordProperty[]
}
