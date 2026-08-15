import type { AxiosInstance } from 'axios'
import { appendPropertyFormData } from '~/utils/appendPropertyFormData'
import type { CreatePropertyResponse } from '~/features/post-property/services/create-property'

export interface PropertyDraftParking {
  type: string
  slots: number
  isFree: boolean
  price?: number
  note?: string
}

export interface PropertyDraftData {
  title?: string
  description?: string
  address?: string
  monthly_price?: number
  deposit?: number
  districtId?: number
  propertyTypeId?: number
  sizeSqm?: number
  floor?: number
  totalFloors?: number
  bedroom?: number
  bathroom?: number
  furnished?: boolean
  availableFrom?: string
  minimumStayLength?: number
  openTime?: string
  closeTime?: string
  lat?: number
  lng?: number
  folderType?: string
  amenityKeys?: number[]
  ruleKeys?: number[]
  parkings?: PropertyDraftParking[]
}

export interface PropertyDraftImage {
  key: string
  url: string
}

export interface PropertyDraft {
  id: string
  userId: string
  data: PropertyDraftData
  images: PropertyDraftImage[]
  createdAt: string
  updatedAt: string
}

function buildFormData(data: Partial<PropertyDraftData>, files: File[], removeImageKeys?: string[]) {
  const formData = new FormData()
  appendPropertyFormData(formData, data as unknown as Record<string, unknown>)
  if (removeImageKeys?.length) {
    removeImageKeys.forEach((key) => formData.append('removeImageKeys', key))
  }
  files.forEach((file) => formData.append('files', file))
  return formData
}

export async function createDraft(api: AxiosInstance, data: Partial<PropertyDraftData>, files: File[]) {
  const formData = buildFormData(data, files)
  const res = await api.post<PropertyDraft>('/property-draft', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function updateDraft(
  api: AxiosInstance,
  id: string,
  data: Partial<PropertyDraftData>,
  files: File[],
  removeImageKeys: string[],
) {
  const formData = buildFormData(data, files, removeImageKeys)
  const res = await api.patch<PropertyDraft>(`/property-draft/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function listDrafts(api: AxiosInstance) {
  const res = await api.get<PropertyDraft[]>('/property-draft')
  return res.data
}

export async function getDraft(api: AxiosInstance, id: string) {
  const res = await api.get<PropertyDraft>(`/property-draft/${id}`)
  return res.data
}

export async function deleteDraft(api: AxiosInstance, id: string) {
  await api.delete(`/property-draft/${id}`)
}

export async function publishDraft(api: AxiosInstance, id: string) {
  const res = await api.post<CreatePropertyResponse>(`/property-draft/${id}/publish`)
  return res.data
}
