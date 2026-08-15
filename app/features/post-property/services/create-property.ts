import type { AxiosInstance } from 'axios'
import { appendPropertyFormData } from '~/utils/appendPropertyFormData'

export interface CreatePropertyPayload {
  userId: string
  districtId: number
  address: string
  lat?: number
  lng?: number
  title: string
  description: string
  monthly_price: number
  deposit?: number
  bedroom?: number
  bathroom?: number
  propertyTypeId: number
  sizeSqm: number
  floor: number
  totalFloors: number
  furnished?: boolean
  isPublished?: boolean
  availableFrom?: string
  minimumStayLength?: number
  folderType?: string
  amenityKeys: number[]
  ruleKeys?: number[]
  parkings?: Array<{ type: string; slots: number; isFree: boolean; price?: number }>
  openTime?: string
  closeTime?: string
}

export interface CreatePropertyResponse {
  id: number
  message?: string
}

export async function createProperty(
  api: AxiosInstance,
  payload: CreatePropertyPayload,
  files: File[],
) {
  const formData = new FormData()

  appendPropertyFormData(formData, payload as unknown as Record<string, unknown>)

  files.forEach((file) => {
    formData.append('files', file)
  })

  const res = await api.post<CreatePropertyResponse>('/property', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}