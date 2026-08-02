import { useQueryClient } from '@tanstack/vue-query'

export function useLogout() {
  const { $axios } = useNuxtApp()
  const authStore = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()

  const logout = async () => {
    try {
      await $axios.post('/auth/logout')
    } finally {
      authStore.clear()
      queryClient.removeQueries({ queryKey: ['favourites'] })
      queryClient.removeQueries({ queryKey: ['profile'] })
      router.replace('/auth/login')
    }
  }

  return { logout }
}
