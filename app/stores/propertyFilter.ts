import { defineStore } from 'pinia'

export const usePropertyFilterStore = defineStore('propertyFilter', {
  state: () => ({
    minPrice: 0,
    maxPrice: 0,
    locationName: '',
    orderType: null as number | null,
    location: null as number | null,
    roomType: 0,
    bedroom: 0,
    bathroom: 0,
    furnishing: 0,
    amenities: [] as number[],
    houseRules: [] as number[],
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

