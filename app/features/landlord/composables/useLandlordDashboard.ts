import type { LandlordDashboardData } from '../types/dashboard'

export function useLandlordDashboard() {
  const { $axios } = useNuxtApp()

  const { data, pending, error, refresh } = useAsyncData('landlord-dashboard', async () => {
    const { data } = await $axios.get<LandlordDashboardData>('/landlord/dashboard')
    return data
  })

  return { data, pending, error, refresh }
}
