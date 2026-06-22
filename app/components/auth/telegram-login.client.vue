<template>
  <div ref="telegramBtn"></div>
</template>

<script setup lang="ts">
import { resolvePostLoginRoute } from '~/utils/roleGuard'

const telegramBtn = ref<HTMLDivElement | null>(null)
const { $axios } = useNuxtApp()
const accessToken = useAccessToken()
const authStore = useAuthStore()

onMounted(() => {
  ;(window as any).onTelegramAuth = async (user: any) => {
    const { data } = await $axios.post<{ accessToken?: string; access_token?: string; user_id: string; is_new_user: boolean }>(
      '/auth/telegram-login',
      user,
    )
    const token = data.accessToken ?? data.access_token
    if (!token) return
    accessToken.value = token
    if (data.is_new_user) {
      await navigateTo('/auth/role-select', { replace: true })
    } else {
      await authStore.fetchProfile(token)
      if (authStore.isAuthenticated) {
        await navigateTo(resolvePostLoginRoute(authStore.user?.role), { replace: true })
      } else {
        accessToken.value = null
        await navigateTo('/auth/login', { replace: true })
      }
    }
  }

  const script = document.createElement('script')
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('data-telegram-login', 'rentify156_bot')
  script.setAttribute('data-size', 'large')
  script.setAttribute('data-userpic', 'true')
  script.setAttribute('data-request-access', 'write')
  script.setAttribute('data-on-auth', 'onTelegramAuth')

  telegramBtn.value?.appendChild(script)
})
</script>
