import { defineStore } from 'pinia'

interface RateLimitCookie {
  retryUntil: number
  returnTo: string
}

const COOKIE_NAME = 'rate_limit'

export const useRateLimitStore = defineStore('rateLimit', {
  state: () => ({
    retryUntil: null as number | null,
    returnTo: '/',
  }),

  actions: {
    trigger(seconds: number | null, from: string) {
      this.retryUntil = seconds !== null ? Date.now() + seconds * 1000 : null
      this.returnTo = from
      this.writeCookie()
    },

    clear() {
      this.retryUntil = null
      this.writeCookie()
    },

    writeCookie() {
      const cookie = useCookie<RateLimitCookie | null>(COOKIE_NAME, { maxAge: 60 * 60 })
      cookie.value = this.retryUntil ? { retryUntil: this.retryUntil, returnTo: this.returnTo } : null
    },

    restore() {
      const cookie = useCookie<RateLimitCookie | null>(COOKIE_NAME)
      if (cookie.value?.retryUntil && cookie.value.retryUntil > Date.now()) {
        this.retryUntil = cookie.value.retryUntil
        this.returnTo = cookie.value.returnTo
      } else if (cookie.value) {
        cookie.value = null
      }
    },
  },
})
