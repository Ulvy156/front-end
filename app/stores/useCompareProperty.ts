import { defineStore } from 'pinia'
import type { PropertyCardItem } 
  from '~/features/browse-properties/interface/property-card-item'

export const useCompareProperty = defineStore('compareProperty', {
  state: () => ({
    propertyCardItem: [] as PropertyCardItem[]
  }),

  getters: {
    queryParams: (state) => ({
      ...state,
    }),
  },

  actions: {
    addItem(item: PropertyCardItem) {
      const exists = this.propertyCardItem.some(
        (p) => p.id === item.id
      )

      if (exists) return // avoid duplicates

      if(this.propertyCardItem.length === 4) return; // limit 4

      this.propertyCardItem.push(item)
    },

    removeItem(id: string) {
      this.propertyCardItem = this.propertyCardItem.filter(
        (p) => p.id !== id
      )
    },
    
    reset() {
      this.$reset()
    },
  },
})

