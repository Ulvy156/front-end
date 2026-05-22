<template>
  <div class="min-h-dvh flex items-center justify-center bg-slate-50">
    <div class="flex flex-col items-center gap-y-3 text-slate-500 text-sm">
      <svg class="w-8 h-8 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span>{{ $t('auth.signingYouIn') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const accessToken = useAccessToken()
const authStore = useAuthStore()
const route = useRoute()

onMounted(async () => {
  const token = (route.query.token as string | undefined)?.trim()
  const isNewUser = route.query.is_new_user === 'true'
  if (token) {
    accessToken.value = token
    if (isNewUser) {
      await navigateTo('/auth/role-select', { replace: true })
    } else {
      await authStore.fetchProfile()
      if (authStore.isAuthenticated) {
        await navigateTo('/', { replace: true })
      } else {
        accessToken.value = null
        await navigateTo('/auth/login', { replace: true })
      }
    }
  } else {
    await navigateTo('/auth/login', { replace: true })
  }
})
</script>
