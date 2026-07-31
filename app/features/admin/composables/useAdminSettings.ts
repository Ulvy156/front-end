import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type {
  CreateSettingPayload,
  PlatformSettings,
  UpdateCustomSettingPayload,
  UpdatePlatformSettingsPayload,
} from '../types/settings'

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

  const createSetting = useMutation({
    mutationFn: async (payload: CreateSettingPayload) => {
      const { data } = await $axios.post<PlatformSettings>('/admin/settings', payload)
      return data
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['admin-settings'], updated)
    },
  })

  const updateCustomSetting = useMutation({
    mutationFn: async (payload: UpdateCustomSettingPayload) => {
      const { data } = await $axios.patch<PlatformSettings>('/admin/settings', payload)
      return data
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['admin-settings'], updated)
    },
  })

  return { data, isPending, isError, updateSettings, createSetting, updateCustomSetting }
}
