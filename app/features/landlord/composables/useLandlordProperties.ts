import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { LandlordPropertiesResponse, LandlordPropertiesFilter, LandlordProperty } from '../types/property'

const QUERY_KEY = 'landlord-properties'

export function useLandlordProperties(filters: Ref<LandlordPropertiesFilter>) {
  const { $axios } = useNuxtApp()
  const queryClient = useQueryClient()

  const { data, isPending, isError } = useQuery({
    queryKey: computed(() => [QUERY_KEY, { ...filters.value }]),
    queryFn: async () => {
      const params: Record<string, string | number | boolean> = {
        page: filters.value.page,
        limit: filters.value.limit,
      }
      if (filters.value.search) params.search = filters.value.search
      if (filters.value.isPublished !== undefined) params.isPublished = filters.value.isPublished
      if (filters.value.isAvailable !== undefined) params.isAvailable = filters.value.isAvailable
      if (filters.value.isFeatured !== undefined) params.isFeatured = filters.value.isFeatured
      if (filters.value.propertyTypeId !== undefined) params.propertyTypeId = filters.value.propertyTypeId
      if (filters.value.provinceId !== undefined) params.provinceId = filters.value.provinceId
      if (filters.value.districtId !== undefined) params.districtId = filters.value.districtId
      if (filters.value.minPrice !== undefined) params.minPrice = filters.value.minPrice
      if (filters.value.maxPrice !== undefined) params.maxPrice = filters.value.maxPrice
      if (filters.value.sortBy) params.sortBy = filters.value.sortBy
      if (filters.value.sortOrder) params.sortOrder = filters.value.sortOrder

      const { data } = await $axios.get<LandlordPropertiesResponse>('/landlord/properties', { params })
      return data
    },
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
  const invalidateDashboard = () => queryClient.invalidateQueries({ queryKey: ['landlord-dashboard'] })

  function updatePropertyInCache(id: string, patch: Partial<LandlordProperty>) {
    queryClient.setQueriesData<LandlordPropertiesResponse>(
      { queryKey: [QUERY_KEY] },
      (old) => old ? { ...old, items: old.items.map(p => p.id === id ? { ...p, ...patch } : p) } : old,
    )
  }

  const togglePublish = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await $axios.patch<{ id: string; isPublished: boolean }>(`/property/toggle-publish/${id}`)
      return data
    },
    onSuccess: (res) => {
      updatePropertyInCache(res.id, { isPublished: res.isPublished })
      invalidateDashboard()
    },
  })

  const toggleAvailability = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await $axios.patch<{ id: string; isAvailable: boolean }>(`/property/toggle-availability/${id}`)
      return data
    },
    onSuccess: (res) => {
      updatePropertyInCache(res.id, { isAvailable: res.isAvailable })
      invalidateDashboard()
    },
  })

  const duplicateProperty = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await $axios.post<LandlordProperty>(`/property/${id}/duplicate`)
      return data
    },
    onSuccess: () => {
      invalidateDashboard()
      invalidate()
    },
  })

  return { data, isPending, isError, togglePublish, toggleAvailability, duplicateProperty }
}
