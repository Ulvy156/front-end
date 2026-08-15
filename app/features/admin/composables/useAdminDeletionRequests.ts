import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Role } from '~/types/role'
import type { DeletionRequestListResponse } from '../types/user'

export interface DeletionRequestFilters {
  search: string
  role: Role | ''
  page: number
  limit: number
}

const QUERY_KEY = 'admin-deletion-requests'

export function useAdminDeletionRequests(filters: Ref<DeletionRequestFilters>) {
  const { $axios } = useNuxtApp()
  const queryClient = useQueryClient()

  const queryKey = computed(() => [QUERY_KEY, filters.value.search, filters.value.role, filters.value.page])

  const { data, isPending, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page: filters.value.page,
        limit: filters.value.limit,
      }
      if (filters.value.search) params.search = filters.value.search
      if (filters.value.role) params.role = filters.value.role
      const { data } = await $axios.get<DeletionRequestListResponse>('/user/deletion-requests', { params })
      return data
    },
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })

  // Also invalidate on error: approval can 404/409 if another admin already
  // approved (or the user cancelled) between page load and click — refetching
  // drops the now-stale row instead of leaving it in the table.
  const approveDeletion = useMutation({
    mutationFn: (id: string) => $axios.patch(`/user/approve-deletion/${id}`),
    onSuccess: invalidate,
    onError: invalidate,
  })

  return { data, isPending, isError, approveDeletion }
}
