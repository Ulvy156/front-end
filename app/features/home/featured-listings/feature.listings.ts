import type {
  PropertyCardLocation,
  PropertyCardType,
} from "~/types/property-card";

export interface FeaturedProperty {
  id: string
  title: string
  monthly_price: number
  sizeSqm: number
  totalViews: number
  bathroom: number,
  bedroom: number,
  isAvailable: boolean,
  images: {
    imageKey: string
  }[]
  _count?: { images: number }

  district: PropertyCardLocation
  propertyType: PropertyCardType
}

export interface PopularDistrict {
  districtId: number;
  nameKh: string;
  nameEn: string;
  totalListings: number;
}
