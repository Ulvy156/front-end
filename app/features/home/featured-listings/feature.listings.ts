export interface FeaturedProperty {
  id: string
  title: string
  price: number
  sizeSqm: number
  totalViews: number
  bathroom: number,
  bedroom: number,
  isAvailable: boolean,
  images: {
    imageKey: string
  }[]

  district: {
    nameEn: string
    nameKh: string
    province: {
      nameEn: string
      nameKh: string
    }
  }

  propertyType: {
    nameEn: string
    nameKh: string
  }
}

export interface PopularDistrict {
  districtId: number;
  nameKh: string;
  nameEn: string;
  totalListings: number;
}

