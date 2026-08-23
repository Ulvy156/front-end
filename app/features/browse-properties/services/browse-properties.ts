import type { AxiosInstance } from 'axios'

import type { Meta, PropertyCardItem } from '../interface/property-card-item'

export interface BrowsePropertiesResponse {
  items: PropertyCardItem[]
  meta: Meta
}

export interface PropertyTypeOption {
  id: number
  nameEn: string
  nameKh: string
  icon: string
}

export interface PropertyAmenityOption {
  id: number
  nameEn: string
  nameKh: string
  icon: string
  code: string
}

export interface PropertyRuleOption {
  id: number
  nameEn: string
  nameKh: string
  icon: string
  key: string
}

export interface LocationSuggestion {
  id: number
  nameEn: string
  nameKh: string
  type: 'district' | 'province'
  label: string
}

export async function fetchBrowseProperties(
  api: AxiosInstance,
  params: Record<string, unknown>,
) {
  const res = await api.post<BrowsePropertiesResponse>(
    '/property/browse-properties',
    params,
  )

  return res.data
}

export async function fetchPropertyTypeOptions(api: AxiosInstance) {
  const res = await api.get('/property-type')

  return res.data as PropertyTypeOption[]
}

export async function fetchPropertyAmenityOptions(api: AxiosInstance) {
  const res = await api.get('/property-amenity')

  return res.data as PropertyAmenityOption[]
}

export async function fetchPropertyRuleOptions(api: AxiosInstance) {
  const res = await api.get('/property-rules')

  return res.data as PropertyRuleOption[]
}

export async function fetchLocationSuggestions(
  api: AxiosInstance,
  query: string,
) {
  const res = await api.get('location', {
    params: { q: query },
  })

  return res.data.map((item: Omit<LocationSuggestion, 'label'>) => ({
    ...item,
    label: `${item.nameEn} — ${item.nameKh}`,
  })) as LocationSuggestion[]
}
