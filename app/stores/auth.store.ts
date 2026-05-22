import { defineStore } from 'pinia'
import { Role } from '~/types/role'

export interface AuthUser {
  id: string
  name: string
  email: string
  imgUrl: string | null
  isLocked: boolean
  role: Role
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
    isUser:      (state) => state.user?.role === Role.USER,
    isLandlord:  (state) => state.user?.role === Role.LANDLORD || state.user?.role === Role.ADMIN,
    isAdmin:     (state) => state.user?.role === Role.ADMIN,
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
