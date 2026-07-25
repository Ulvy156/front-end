import { defineStore } from 'pinia'
import type { PlatformSettings } from '~/types/settings'

export const useAppSettingsStore = defineStore('appSettings', {
  state: () => ({
    settings: null as PlatformSettings | null,
    isFetching: false,
    // Fetched once per app session (see session.global.ts) — avoids
    // re-hitting /settings on every navigation.
    fetched: false,
    // The exact `message` from the backend's 503 body (see MaintenanceGuard),
    // captured by the axios interceptor — shown as-is instead of copy we made up.
    maintenanceMessage: null as string | null,
  }),

  getters: {
    maintenanceMode: (state) => state.settings?.maintenanceMode ?? false,
    registrationEnabled: (state) => state.settings?.registrationEnabled ?? true,
    maxPropertiesPerLandlord: (state) => state.settings?.maxPropertiesPerLandlord ?? null,
    maxImagesPerProperty: (state) => state.settings?.maxImagesPerProperty ?? null,
    minPropertyPrice: (state) => {
      const value = state.settings?.minPropertyPrice
      return value === null || value === undefined ? null : Number(value)
    },
    maxPropertyPrice: (state) => {
      const value = state.settings?.maxPropertyPrice
      return value === null || value === undefined ? null : Number(value)
    },
    commissionRate: (state) => Number(state.settings?.commissionRate ?? 0),
  },

  actions: {
    async fetchSettings() {
      if (this.fetched) return
      await this.refetchSettings()
      this.fetched = true
    },

    async refetchSettings() {
      const api = useApi()
      this.isFetching = true
      try {
        const { data } = await api.get<PlatformSettings>('/settings')
        this.settings = data
        if (!data.maintenanceMode) this.maintenanceMessage = null
      } catch {
        // Keep the last known settings (or defaults) — the backend still
        // enforces everything server-side regardless of this fetch failing.
      } finally {
        this.isFetching = false
      }
    },

    setMaintenanceMessage(message: string | null) {
      this.maintenanceMessage = message
    },

    // No dedicated polling — maintenance mode is flipped on/off purely from
    // the outcome of whatever API calls the app is already making (see the
    // axios interceptor), so it costs zero extra requests.
    setMaintenanceMode(active: boolean) {
      if (this.settings) {
        this.settings.maintenanceMode = active
      } else {
        this.settings = { maintenanceMode: active } as PlatformSettings
      }
      if (!active) this.maintenanceMessage = null
    },
  },
})
