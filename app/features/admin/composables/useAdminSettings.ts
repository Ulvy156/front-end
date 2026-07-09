import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { PlatformSettings, UpdatePlatformSettingsPayload } from '../types/settings'

export function useAdminSettings() {
  const { $axios } = useNuxtApp()
  const queryClient = useQueryClient()

  const { data, isPending, isError } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data } = await $axios.get<PlatformSettings>('/admin/settings')
      return data
    },
  })

  const updateSettings = useMutation({
    mutationFn: async (payload: UpdatePlatformSettingsPayload) => {
      const { data } = await $axios.patch<PlatformSettings>('/admin/settings', payload)
      return data
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['admin-settings'], updated)
    },
  })

  return { data, isPending, isError, updateSettings }
}
