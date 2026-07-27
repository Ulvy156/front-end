import { useApi } from './useApi'

interface District {
  id: number
  nameEn: string
  nameKh?: string
}

interface Province {
  id: number
  nameEn: string
  nameKh?: string
}

interface ProvinceCoordinates {
  id: number
  latitude: number
  longitude: number
}

export const useCambodiaLocations = () => {
  const api = useApi()
  let cachedProvinces: Province[] | null = null

  const fetchProvinces = async (): Promise<Province[]> => {
    if (cachedProvinces) return cachedProvinces

    try {
      const { data } = await api.get('location/province')

      cachedProvinces = Array.isArray(data) ? data : data?.data || []

      return cachedProvinces
    } catch (error) {
      console.error('Failed to fetch provinces:', error)
      return []
    }
  }

  const fetchDistrictsByProvinceId = async (
    provinceId: number
  ): Promise<District[]> => {
    try {
      const { data } = await api.get(
        `location/district/province/${provinceId}`
      )

      return Array.isArray(data) ? data : data?.data || []
    } catch (error) {
      console.error('Failed to fetch districts:', error)
      return []
    }
  }

  const getProvinceId = async (
    provinceName: string
  ): Promise<number | null> => {
    const provinces = await fetchProvinces()

    const province = provinces.find(
      (p) => p.nameEn.toLowerCase() === provinceName.toLowerCase()
    )

    return province?.id || null
  }

  const fetchProvinceCoordinates = async (
    provinceId: number
  ): Promise<ProvinceCoordinates | null> => {
    try {
      const { data } = await api.get(
        `location/province/${provinceId}/coordinates`
      )

      return data?.data ?? data ?? null
    } catch (error) {
      console.error('Failed to fetch province coordinates:', error)
      return null
    }
  }

  return {
    fetchProvinces,
    fetchDistrictsByProvinceId,
    getProvinceId,
    fetchProvinceCoordinates,
  }
}