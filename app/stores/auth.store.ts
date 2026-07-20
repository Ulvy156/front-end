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
    // Set once a refresh-token attempt has resolved (success or failure) in
    // this app session, so hydrateAuth() doesn't re-hit /auth/refresh-token
    // on every subsequent navigation for a guest who has no session.
    sessionChecked: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isUser:      (state) => state.user?.role === Role.USER,
    isLandlord:  (state) => state.user?.role === Role.LANDLORD || state.user?.role === Role.ADMIN,
    isAdmin:     (state) => state.user?.role === Role.ADMIN,
  },

  actions: {
    async fetchProfile(token?: string) {
      const api = useApi()
      this.isFetching = true
      try {
        const { data } = await api.get<AuthUser>('/auth/profile', token ? {
          headers: { Authorization: `Bearer ${token}` },
        } : undefined)
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
