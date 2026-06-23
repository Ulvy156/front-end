export function useRequireAuth() {
  const authStore = useAuthStore()

  function requireAuth(action: () => void) {
    if (!authStore.isAuthenticated) {
      navigateTo('/auth/login')
      return
    }
    action()
  }

  return { requireAuth }
}
