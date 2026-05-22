import type { DashboardData } from '../types/dashboard'

export function useAdminDashboard() {
  const { $axios } = useNuxtApp()

  const { data, pending, error, refresh } = useAsyncData('admin-dashboard', async () => {
    const { data } = await $axios.get<DashboardData>('/admin/dashboard')
    return data
  })

  return { data, pending, error, refresh }
}
