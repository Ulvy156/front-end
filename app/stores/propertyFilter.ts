import { defineStore } from 'pinia'

export const usePropertyFilterStore = defineStore('propertyFilter', {
  state: () => ({
    priceRange: {
        min: 0,
        max: 0,
    },
    locationName: '',
    orderType: null as number | null,
    location: null as number | null,
    roomType: 0,
    furnishing: {
        bedroom: 0,
        bathroom: 0,
        furnishing: 0,
    },
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

