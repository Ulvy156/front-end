import { defineStore } from 'pinia'

export interface AuthUser {
  id: string
  name: string
  email: string
  imgUrl: string | null
  isLocked: boolean
  role: 'USER' | 'LANDLORD' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    isFetching: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isLandlord: (state) => state.user?.role === 'LANDLORD' || state.user?.role === 'ADMIN',
  },

  actions: {
    async fetchProfile() {
      const api = useApi()
      this.isFetching = true
      try {
        const { data } = await api.get<AuthUser>('/auth/profile')
        this.user = data
      } catch {
        this.user = null
      } finally {
        this.isFetching = false
      }
    },

    setUser(user: AuthUser) {
      this.user = user
    },

    clear() {
      this.user = null
    },
  },
})
