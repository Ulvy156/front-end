import { hydrateAuth } from '~/utils/roleGuard'
import { useAppSettingsStore } from '~/stores/appSettings'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const appSettingsStore = useAppSettingsStore()

  // /auth/callback handles its own token application (from the query string) and,
  // for existing users, its own fetchProfile() call. Letting hydrateAuth() run here
  // too made it opportunistically rotate the just-issued refresh_token cookie before
  // the user ever reaches role-select — starting the backend's 10s rotation-grace
  // clock early and causing "Invalid refresh token" on the follow-up refresh call in
  // role-select.vue once the user took a few seconds to pick a role.
  const skipAuthHydration = to.path === '/auth/callback'

  // Independent backend calls — run in parallel instead of stacking their
  // latency sequentially on every SSR navigation (was adding ~1 extra
  // backend round trip to TTFB on every request).
  await Promise.all([
    skipAuthHydration ? Promise.resolve() : hydrateAuth(),
    appSettingsStore.fetchSettings(),
  ])

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
