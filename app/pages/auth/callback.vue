<template>
  <div class="min-h-dvh flex items-center justify-center bg-slate-50">
    <div class="flex flex-col items-center gap-y-3 text-slate-500 text-sm">
      <svg class="w-8 h-8 animate-spin text-emerald-600" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span>{{ $t('auth.signingYouIn') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { resolvePostLoginRoute } from '~/utils/roleGuard'

definePageMeta({ layout: 'auth' })

const authStore = useAuthStore()
const route = useRoute()

// The backend sets the access_token/refresh_token cookies directly on this
// redirect (see google/callback in auth.controller.ts) — no token in the URL
// to leak via browser history or access logs, so there's nothing to read
// from route.query beyond is_new_user.
onMounted(async () => {
  const isNewUser = route.query.is_new_user === 'true'
  if (isNewUser) {
    await navigateTo({ path: '/auth/role-select', query: { is_new_user: 'true' } }, { replace: true })
    return
  }

  await authStore.fetchProfile()
  if (authStore.isAuthenticated) {
    await navigateTo(resolvePostLoginRoute(authStore.user?.role), { replace: true })
  } else {
    await navigateTo('/auth/login', { replace: true })
  }
})
</script>
