import { useQuery } from '@tanstack/vue-query'
import type { AdminReportDetail } from '../types/report'

export function useAdminReportDetail(reportId: Ref<number | null>) {
  const { $axios } = useNuxtApp()

  return useQuery({
    queryKey: computed(() => ['admin-report-detail', reportId.value]),
    queryFn: async () => {
      const { data } = await $axios.get<AdminReportDetail>(
        `/property-report/${reportId.value}`,
      )
      return data
    },
    enabled: computed(() => !!reportId.value),
  })
}
