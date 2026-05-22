<template>
  <div ref="telegramBtn"></div>
</template>

<script setup lang="ts">
const telegramBtn = ref<HTMLDivElement | null>(null)
const { $axios } = useNuxtApp()
const accessToken = useCookie<string | null>('access_token', { sameSite: 'lax' })
const authStore = useAuthStore()

onMounted(() => {
  ;(window as any).onTelegramAuth = async (user: any) => {
    const { data } = await $axios.post<{ accessToken: string; user_id: string }>(
      '/auth/telegram-login',
      user,
    )
    accessToken.value = data.accessToken
    await authStore.fetchProfile()
    await navigateTo('/')
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
