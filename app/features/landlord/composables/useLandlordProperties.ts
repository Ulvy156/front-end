import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { LandlordPropertiesResponse, LandlordPropertiesFilter } from '../types/property'

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

      const { data } = await $axios.get<LandlordPropertiesResponse>('/landlord/properties', { params })
      return data
    },
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })

  const duplicateProperty = useMutation({
    mutationFn: (id: string) => $axios.post(`/property/${id}/duplicate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landlord-dashboard'] })
      invalidate()
    },
  })

  return { data, isPending, isError, duplicateProperty }
}
