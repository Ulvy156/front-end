import { defineStore } from 'pinia'
import type { PlatformSettings } from '~/types/settings'

export const useAppSettingsStore = defineStore('appSettings', {
  state: () => ({
    settings: null as PlatformSettings | null,
    isFetching: false,
    // Fetched once per app session (see session.global.ts) — avoids
    // re-hitting /settings on every navigation.
    fetched: false,
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
      const api = useApi()
      this.isFetching = true
      try {
        const { data } = await api.get<PlatformSettings>('/settings')
        this.settings = data
      } catch {
        // Keep defaults (no bounds enforced client-side) — the backend still
        // enforces everything server-side regardless of this fetch failing.
      } finally {
        this.isFetching = false
        this.fetched = true
      }
    },
  },
})
