import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { AppSetting, CreateSettingPayload, UpdateSettingPayload } from '../types/settings'

export function useAdminSettings() {
  const { $axios } = useNuxtApp()
  const queryClient = useQueryClient()

  const { data, isPending, isError } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data } = await $axios.get<AppSetting[]>('/admin/settings')
      return data
    },
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-settings'] })

  const createSetting = useMutation({
    mutationFn: async (payload: CreateSettingPayload) => {
      const { data } = await $axios.post<AppSetting>('/admin/settings', payload)
      return data
    },
    onSuccess: invalidate,
  })

  const updateSetting = useMutation({
    mutationFn: async ({ category, key, payload }: { category: string, key: string, payload: UpdateSettingPayload }) => {
      const { data } = await $axios.patch<AppSetting>(
        `/admin/settings/${encodeURIComponent(category)}/${encodeURIComponent(key)}`,
        payload,
      )
      return data
    },
    onSuccess: invalidate,
  })

  const deleteSetting = useMutation({
    mutationFn: async ({ category, key }: { category: string, key: string }) => {
      await $axios.delete(`/admin/settings/${encodeURIComponent(category)}/${encodeURIComponent(key)}`)
    },
    onSuccess: invalidate,
  })

  return { data, isPending, isError, createSetting, updateSetting, deleteSetting }
}
