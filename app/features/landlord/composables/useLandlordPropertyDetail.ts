import { useQuery } from '@tanstack/vue-query'
import type { LandlordPropertyDetail } from '../types/property'

export function useLandlordPropertyDetail(id: Ref<string>) {
  const { $axios } = useNuxtApp()

  const { data, isPending, isError } = useQuery({
    queryKey: computed(() => ['landlord-property-detail', id.value]),
    queryFn: async () => {
      const { data } = await $axios.get<LandlordPropertyDetail>(`/landlord/properties/${id.value}`)
      return data
    },
    enabled: computed(() => !!id.value),
  })

  return { property: data, isPending, isError }
}
