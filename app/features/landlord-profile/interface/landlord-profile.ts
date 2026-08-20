import type { PhoneNumberType } from '~/types/phoneNumber'
import type {
  PropertyCardLocation,
  PropertyCardType,
} from '~/types/property-card'

export interface LandlordPhone {
  phoneNumber: string
  type: PhoneNumberType
}

export type LandlordContact =
  | { method: 'TELEGRAM'; value: string }
  | { method: 'PHONE'; value: string }
  | null

export interface PublicLandlord {
  id: string
  name: string
  email: string | null
  imgUrl: string | null
  createdAt: string
  phones: LandlordPhone[]
  contact: LandlordContact
  totalPublishedProperties: number
}

interface PropertyImage {
  imageKey: string
}

export interface LandlordPropertyItem {
  id: string
  title: string
  monthly_price: number
  sizeSqm: number
  totalViews: number
  bathroom: number
  bedroom: number
  isAvailable: boolean
  images: PropertyImage[]
  _count?: { images: number }
  district: PropertyCardLocation
  propertyType: PropertyCardType
}

export interface LandlordPropertiesMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface LandlordProfileResponse {
  landlord: PublicLandlord
  properties: {
    items: LandlordPropertyItem[]
    meta: LandlordPropertiesMeta
  }
}
