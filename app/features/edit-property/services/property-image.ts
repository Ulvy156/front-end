import type { AxiosInstance } from 'axios'

export interface UpdatePropertyImagesPayload {
  files?: File[]
  removeImageIds?: string[]
  coverImageId?: string
  coverNewFileIndex?: number
}

export async function updatePropertyImages(
  api: AxiosInstance,
  propertyId: string,
  payload: UpdatePropertyImagesPayload,
) {
  const formData = new FormData()
  for (const file of payload.files ?? []) {
    formData.append('files', file)
  }
  for (const id of payload.removeImageIds ?? []) {
    formData.append('removeImageIds', id)
  }
  if (payload.coverImageId) {
    formData.append('coverImageId', payload.coverImageId)
  }
  if (payload.coverNewFileIndex !== undefined) {
    formData.append('coverNewFileIndex', String(payload.coverNewFileIndex))
  }
  const { data } = await api.patch(`/property/${propertyId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
