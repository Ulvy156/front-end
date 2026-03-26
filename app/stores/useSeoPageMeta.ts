import { defineStore } from 'pinia'

interface SEO {
  title: string
  description: string
  image: string
  pageUrl: string
}
export const useSeoPageMeta = defineStore('useSeoPageMeta', {
  state: () => ({
    seoPageData: {} as SEO,
  }),

  actions: {

    setSEO(value: SEO) {
      this.seoPageData = value;
    },

    reset() {
      this.$reset()
    },
  },
})

