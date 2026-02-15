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
    reset() {
      this.$reset()
    },
  },
})

