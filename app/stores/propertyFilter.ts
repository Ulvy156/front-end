import { defineStore } from 'pinia'

export const usePropertyFilterStore = defineStore('propertyFilter', {
  state: () => ({
    minPrice: 0,
    maxPrice: 0,
    locationName: '',
    orderType: null as number | null,
    location: null as number | null,
    locationType: null as string | null,
    roomType: 0,
    bedroom: 0,
    bathroom: 0,
    furnishing: 0,
    amenities: [] as number[],
    houseRules: [] as number[],
    result: 0,
    page: 1,
    limit: 6,
    lng: null as number | null,
    lat: null as number | null,
  }),

  getters: {
    queryParams: (state) => ({
      ...state,
    }),
  },

  actions: {
    init() {
      if (!import.meta.client) return

      const cookie = useCookie('property_filter', {
        maxAge: 60 * 60 * 24 * 7,

        encode: (value) => JSON.stringify(value),
        decode: (value) => {
          try {
            return JSON.parse(value)
          } catch {
            return null
          }
        },
      })

      // Restore state
      if (cookie.value) {
        Object.assign(this.$state, cookie.value)
      }

      // Auto save on state change
      this.$subscribe(() => {
        cookie.value = { ...this.$state }
      })
    },

    reset() {
      this.$reset()

      if (import.meta.client) {
        const cookie = useCookie('property_filter')
        cookie.value = null
      }
    },
  },
})
