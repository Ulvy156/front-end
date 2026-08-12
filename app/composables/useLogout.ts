import { useQueryClient } from '@tanstack/vue-query'

export function useLogout() {
  const { $axios } = useNuxtApp()
  const authStore = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()

  const logout = async () => {
    // Local state is what actually gates access, and the HttpOnly auth
    // cookies get cleared by this response's Set-Cookie header whether or
    // not we wait for it — so don't block the redirect on the network call.
    authStore.clear()
    queryClient.removeQueries({ queryKey: ['favourites'] })
    queryClient.removeQueries({ queryKey: ['profile'] })
    router.replace('/auth/login')
    $axios.post('/auth/logout').catch(() => {})
  }

  return { logout }
}
