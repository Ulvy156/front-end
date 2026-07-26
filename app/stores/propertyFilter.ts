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
    limit: 20,
    lng: null as number | null,
    lat: null as number | null,
  }),

  getters: {
    // `result` is derived UI state (the fetched item count), not a filter —
    // it must be excluded so writing it back doesn't retrigger a refetch.
    // Listed explicitly (rather than destructuring `state`) because in dev
    // mode Pinia's getter `state` argument carries the whole store instance
    // ($id, actions, other getters, HMR internals) alongside the real state
    // fields — a blind `...rest` spread leaks all of that into the request
    // body, including a self-reference to this very getter.
    queryParams: (state) => ({
      minPrice: state.minPrice,
      maxPrice: state.maxPrice,
      locationName: state.locationName,
      orderType: state.orderType,
      location: state.location,
      locationType: state.locationType,
      roomType: state.roomType,
      bedroom: state.bedroom,
      bathroom: state.bathroom,
      furnishing: state.furnishing,
      amenities: state.amenities,
      houseRules: state.houseRules,
      page: state.page,
      limit: state.limit,
      lng: state.lng,
      lat: state.lat,
    }),
  },
  actions: {
    init() {
      const cookie = useCookie('property_filter', {
        maxAge: 60 * 60 * 24 * 7,

        encode: (value) => encodeURIComponent(JSON.stringify(value)),
        decode: (value) => {
          try {
            return JSON.parse(decodeURIComponent(value))
          } catch {
            return null
          }
        },
      })

      // Restore state, but don't clobber a location already set in memory
      // (e.g. by a breadcrumb or popular-location click right before
      // navigating here) with a stale cookie snapshot written before that
      // click — this action re-runs on every mount of /properties.
      const hasPendingLocation = this.location !== null || this.locationName !== ''
      if (cookie.value && !hasPendingLocation) {
        Object.assign(this.$state, cookie.value)
      }

      // limit is a config default, not a user preference — always enforce current value
      this.limit = 20

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
