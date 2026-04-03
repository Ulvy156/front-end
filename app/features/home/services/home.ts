import type { AxiosInstance } from 'axios'

import type {
  FeaturedProperty,
  PopularDistrict,
} from '../featured-listings/feature.listings'

export interface HomePageData {
  featuredListings: FeaturedProperty[]
  latestListings: FeaturedProperty[]
  popularLocations: PopularDistrict[]
}

export async function fetchHomePageData(api: AxiosInstance) {
  const res = await api.get('/property/home-page')

  return res.data as HomePageData
}
