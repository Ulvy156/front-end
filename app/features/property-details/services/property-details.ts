import type { AxiosInstance } from 'axios'
import type { PropertyCardItem } from '~/features/browse-properties/interface/property-card-item'

import type { PropertyDetail } from '../interface/properties-details'

export async function fetchPropertyDetails(params: {
  api: AxiosInstance
  id: string
  lat: number | null
  lng: number | null
}) {
  const { api, ...request } = params
  const res = await api.post<PropertyDetail>('/property/property-details', request)

  return res.data
}

export async function fetchRelatedProperties(api: AxiosInstance, id: string) {
  const res = await api.get(`/property/related-properties/${id}`)

  return res.data as PropertyCardItem[]
}
