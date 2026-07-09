export interface LocalizedName {
  nameEn: string
  nameKh: string
}

export interface PropertyCardLocation extends LocalizedName {
  province: LocalizedName
}

export interface PropertyCardType extends LocalizedName {
  icon: string
}

export interface PropertyCardViewModel {
  id: string
  title: string
  content?: string
  monthlyPrice: number
  totalViews: number
  photoCount: number
  bathroom: number
  bedroom: number
  isAvailable: boolean
  imageSrc: string
  location: PropertyCardLocation
  propertyType: PropertyCardType
  sizeSqm: number
  distanceKm?: number | null
}
