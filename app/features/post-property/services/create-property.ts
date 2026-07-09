import type { AxiosInstance } from 'axios'

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

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    // Send parkings as JSON string with proper types
    if (key === 'parkings' && Array.isArray(value)) {
      const normalized = value.map((p) => ({
        type: p.type,
        slots: Number(p.slots),
        isFree: Boolean(p.isFree),
        ...(p.isFree ? {} : { price: Number(p.price) }),
        ...(p.note ? { note: p.note } : {}),
      }))
      formData.append('parkings', JSON.stringify(normalized))
      return
    }

    // Booleans: send as 1/0
    if (key === 'furnished' || key === 'isPublished') {
      formData.append(key, value ? '1' : '0')
      return
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(`${key}[]`, String(item))
      })
      return
    }

    formData.append(key, String(value))
  })

  files.forEach((file) => {
    formData.append('files', file)
  })

  try {
    const res = await api.post<CreatePropertyResponse>('/property', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  } catch (error: any) {
    console.error('Backend error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    throw error
  }
}