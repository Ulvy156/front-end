import { hydrateAuth } from '~/utils/roleGuard'
import { useAppSettingsStore } from '~/stores/appSettings'

export default defineNuxtRouteMiddleware(async (to) => {
  await hydrateAuth()

  const authStore = useAuthStore()
  const appSettingsStore = useAppSettingsStore()
  await appSettingsStore.fetchSettings()

  // Backend already blocks non-admin requests with a 503 while maintenance
  // mode is on; this just gets them off the site's pages and onto a page
  // that explains why, instead of pages half-failing to load data.
  const maintenanceExempt = to.path === '/maintenance' || to.path === '/auth/login'
  if (appSettingsStore.maintenanceMode && !authStore.isAdmin && !maintenanceExempt) {
    return navigateTo('/maintenance')
  }
  if (!appSettingsStore.maintenanceMode && to.path === '/maintenance') {
    return navigateTo('/')
  }
})
