import { useQuery } from '@tanstack/vue-query'
import type { AdminPropertyDetail } from '../types/property'

export function useAdminPropertyDetail(propertyId: Ref<string | null>) {
  const { $axios } = useNuxtApp()

  return useQuery({
    queryKey: computed(() => ['admin-property-detail', propertyId.value]),
    queryFn: async () => {
      const { data } = await $axios.get<AdminPropertyDetail>(
        `/admin/properties/${propertyId.value}`,
      )
      return data
    },
    enabled: computed(() => !!propertyId.value),
  })
}
