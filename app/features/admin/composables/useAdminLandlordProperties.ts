import { useQuery } from '@tanstack/vue-query'
import type { LandlordPropertiesResponse } from '../types/landlord'

export function useAdminLandlordProperties(landlordId: Ref<string | null>) {
  const { $axios } = useNuxtApp()

  return useQuery({
    queryKey: computed(() => ['admin-landlord-properties', landlordId.value]),
    queryFn: async () => {
      const { data } = await $axios.get<LandlordPropertiesResponse>(
        `/admin/landlords/${landlordId.value}/properties`,
      )
      return data
    },
    enabled: computed(() => !!landlordId.value),
  })
}
