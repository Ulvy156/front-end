import { defineStore } from 'pinia'
import type { PropertyCardItem }
  from '~/features/browse-properties/interface/property-card-item'

export const useCompareProperty = defineStore('compareProperty', {
  state: () => ({
    propertyCardItem: [] as PropertyCardItem[],
    isCompare: false
  }),

  getters: {
    getImage: (state) =>
      state.propertyCardItem.map((val) => ({
        img: val.images,
        id: val.id,
        title: val.title
      })),
  },

  actions: {
    addItem(item: PropertyCardItem) {
      const exists = this.isItemExist(item.id);

      if (exists) return // avoid duplicates

      if (this.propertyCardItem.length === 4) return; // limit 4

      this.propertyCardItem.push(item)
    },

    isItemExist(id: string) {
      return this.propertyCardItem.some(
        (p) => p.id === id
      )
    },

    removeItem(id: string) {
      this.propertyCardItem = this.propertyCardItem.filter(
        (p) => p.id !== id
      );
    },

    reset() {
      this.$reset()
    },
  },
})

