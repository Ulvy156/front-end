export interface AdminProperty {
  id: string
  title: string
  monthly_price: number
  isPublished: boolean
  isAvailable: boolean
  isFeatured: boolean
  totalViews: number
  favouriteCount: number
  createdAt: string
  user: { name: string; email: string }
  images: { imageKey: string }[]
  district: {
    nameEn: string
    nameKh: string
    province: { nameEn: string; nameKh: string }
  }
}
