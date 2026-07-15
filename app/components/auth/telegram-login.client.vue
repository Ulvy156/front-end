<template>
  <div class="relative inline-block h-10 w-[238px]">
    <div
      v-if="!isWidgetReady"
      class="absolute inset-0 rounded-md bg-gray-100 animate-pulse"
    />
    <div ref="telegramBtn" class="absolute inset-0" />
  </div>
</template>

<script setup lang="ts">
import { resolvePostLoginRoute } from '~/utils/roleGuard'

useHead({
  link: [
    { rel: 'preload', href: 'https://telegram.org/js/telegram-widget.js?22', as: 'script', crossorigin: 'anonymous' },
    { rel: 'preconnect', href: 'https://oauth.telegram.org' },
  ],
})

const telegramBtn = ref<HTMLDivElement | null>(null)
const isWidgetReady = ref(false)
const { $axios } = useNuxtApp()
const accessToken = useAccessToken()
const hasSession = useHasSession()
const authStore = useAuthStore()

onMounted(() => {
  const onMessage = (e: MessageEvent) => {
    if (e.origin !== 'https://oauth.telegram.org') return
    try {
      const data = JSON.parse(e.data)
      if (data.event === 'ready') isWidgetReady.value = true
    } catch {
      // ignore non-JSON messages from other origins
    }
  }
  window.addEventListener('message', onMessage)
  onUnmounted(() => window.removeEventListener('message', onMessage))

  ;(window as any).onTelegramAuth = async (user: any) => {
    const { data } = await $axios.post<{ accessToken?: string; access_token?: string; user_id: string; is_new_user: boolean }>(
      '/auth/telegram-login',
      user,
    )
    const token = data.accessToken ?? data.access_token
    if (!token) return
    accessToken.value = token
    hasSession.value = true
    if (data.is_new_user) {
      await navigateTo('/auth/role-select', { replace: true })
    } else {
      await authStore.fetchProfile(token)
      if (authStore.isAuthenticated) {
        await navigateTo(resolvePostLoginRoute(authStore.user?.role), { replace: true })
      } else {
        accessToken.value = null
        hasSession.value = null
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
  script.setAttribute('data-onauth', 'onTelegramAuth(user)')

  telegramBtn.value?.appendChild(script)
})
</script>
