import type { AxiosInstance } from 'axios'
import type { FavouriteItem, FavouriteRecord } from '../types/favourite'

export const saveFavourite = async (
  api: AxiosInstance,
  propertyId: string,
): Promise<FavouriteRecord> => {
  const { data } = await api.post<FavouriteRecord>('/user-favourite', { propertyId })
  return data
}

export const removeFavourite = async (
  api: AxiosInstance,
  favouriteId: string,
): Promise<void> => {
  await api.delete(`/user-favourite/${favouriteId}`)
}

export const fetchAllFavourites = async (
  api: AxiosInstance,
  userId: string,
): Promise<FavouriteItem[]> => {
  const { data } = await api.get<FavouriteItem[]>(`/user-favourite/all/user-id/${userId}`)
  return data
}
