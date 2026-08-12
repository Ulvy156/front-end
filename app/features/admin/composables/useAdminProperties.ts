import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { AdminPropertiesResponse, AdminPropertiesFilter } from '../types/property'

const QUERY_KEY = 'admin-properties'

export function useAdminProperties(filters: Ref<AdminPropertiesFilter>) {
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
      if (filters.value.isFeatured !== undefined) params.isFeatured = filters.value.isFeatured
      if (filters.value.isAvailable !== undefined) params.isAvailable = filters.value.isAvailable
      if (filters.value.isLocked !== undefined) params.isLocked = filters.value.isLocked
      if (filters.value.landlordId) params.landlordId = filters.value.landlordId
      if (filters.value.propertyId) params.propertyId = filters.value.propertyId

      const { data } = await $axios.get<AdminPropertiesResponse>('/admin/properties', { params })
      return data
    },
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })

  const togglePublish = useMutation({
    mutationFn: (id: string) => $axios.patch(`/property/toggle-publish/${id}`),
    onSuccess: invalidate,
  })

  const toggleAvailability = useMutation({
    mutationFn: (id: string) => $axios.patch(`/property/toggle-availability/${id}`),
    onSuccess: invalidate,
  })

  const setFeatured = useMutation({
    mutationFn: (id: string) => $axios.patch(`/property/set-feature/${id}`),
    onSuccess: invalidate,
  })

  const deleteProperty = useMutation({
    mutationFn: (id: string) => $axios.delete(`/property/${id}`),
    onSuccess: invalidate,
  })

  const lockProperty = useMutation({
    mutationFn: (id: string) => $axios.patch(`/property/lock/${id}`),
    onSuccess: invalidate,
  })

  const unlockProperty = useMutation({
    mutationFn: (id: string) => $axios.patch(`/property/unlock/${id}`),
    onSuccess: invalidate,
  })

  return { data, isPending, isError, togglePublish, toggleAvailability, setFeatured, deleteProperty, lockProperty, unlockProperty }
}
