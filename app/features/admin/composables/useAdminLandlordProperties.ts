import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { LandlordPropertiesResponse, ResetLimitResponse } from '../types/landlord'

export function useAdminLandlordProperties(landlordId: Ref<string | null>) {
  const { $axios } = useNuxtApp()
  const queryClient = useQueryClient()
  const queryKey = computed(() => ['admin-landlord-properties', landlordId.value])

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await $axios.get<LandlordPropertiesResponse>(
        `/admin/landlords/${landlordId.value}/properties`,
      )
      return data
    },
    enabled: computed(() => !!landlordId.value),
  })

  const resetLimit = useMutation({
    mutationFn: async () => {
      const { data } = await $axios.patch<ResetLimitResponse>(
        `/admin/landlords/${landlordId.value}/reset-limit`,
      )
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKey.value }),
  })

  return { ...query, resetLimit }
}
