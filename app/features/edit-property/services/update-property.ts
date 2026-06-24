import type { AxiosInstance } from 'axios'

export interface UpdatePropertyPayload {
  title?: string
  description?: string
  monthly_price?: number
  deposit?: number
  bedroom?: number
  bathroom?: number
  floor?: number
  totalFloors?: number
  sizeSqm?: number
  furnished?: boolean
  districtId?: number
  address?: string
  locationUrl?: string
  lat?: number | null
  lng?: number | null
  propertyTypeId?: number
  minimumStayLength?: number
  availableFrom?: string
  amenityKeys?: number[]
  ruleKeys?: number[]
  parkings?: Array<{ type: string; slots: number; isFree: boolean; price?: number }>
  openTime?: string
  closeTime?: string
}

export async function updateProperty(
  api: AxiosInstance,
  propertyId: string,
  payload: UpdatePropertyPayload,
) {
  const { data } = await api.patch(`/property/${propertyId}`, payload)
  return data
}
