import type { AxiosInstance } from 'axios'

export async function uploadPropertyImage(
  api: AxiosInstance,
  propertyId: string,
  file: File,
) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post(`/property-image/${propertyId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deletePropertyImage(
  api: AxiosInstance,
  imageId: string,
) {
  await api.delete(`/property-image/${imageId}`)
}

export async function setCoverImage(
  api: AxiosInstance,
  imageId: string,
) {
  await api.patch(`/property-image/${imageId}/set-cover`)
}
