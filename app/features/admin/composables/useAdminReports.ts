import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { AdminReportsResponse, AdminReportsFilter } from '../types/report'
import type { ReportType } from '~/features/property-details/composable/usePropertyReport'

export function useAdminReports(filter: Ref<AdminReportsFilter>) {
  const { $axios } = useNuxtApp()
  const queryClient = useQueryClient()

  const { data, isPending } = useQuery({
    queryKey: computed(() => ['admin-reports', filter.value]),
    queryFn: async () => {
      const params: Record<string, any> = {
        page: filter.value.page,
        limit: filter.value.limit,
      }
      if (filter.value.propertyId) params.propertyId = filter.value.propertyId
      if (filter.value.reportTypeId) params.reportTypeId = filter.value.reportTypeId

      const { data } = await $axios.get<AdminReportsResponse>('/property-report', { params })
      return data
    },
  })

  const { data: reportTypes } = useQuery({
    queryKey: ['report-types'],
    queryFn: async () => {
      const { data } = await $axios.get<ReportType[]>('/report-type')
      return data
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => $axios.delete(`/property-report/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-reports'] }),
  })

  return { data, isPending, reportTypes, remove }
}
