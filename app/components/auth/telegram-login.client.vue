<template>
  <div class="group relative inline-block h-10 w-[238px]">
    <!-- Custom label. The real Telegram widget below doesn't support
         custom button text, so this is a visual skin only: the actual
         (invisible) widget iframe sits on top and receives the click. -->
    <button
      type="button"
      tabindex="-1"
      class="absolute inset-0 flex items-center justify-center gap-x-2
             rounded-xl border border-slate-200 bg-white
             font-medium text-slate-700 text-sm
             group-hover:border-slate-300 group-hover:shadow-sm
             group-active:scale-[0.99] transition-all duration-150"
    >
      <Icon name="mdi:telegram" :size="18" class="text-[#26A5E4]" />
      <span>{{ t('auth.telegram') }}</span>
    </button>

    <div
      v-if="!isWidgetReady"
      class="absolute inset-0 rounded-xl bg-gray-100 animate-pulse"
    />
    <div ref="telegramBtn" class="absolute inset-0 opacity-0 overflow-hidden" />
  </div>
</template>

<script setup lang="ts">
import { resolvePostLoginRoute } from '~/utils/roleGuard'
import { useErrorMsg } from '~/composables/useErrorMsg'

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
const authStore = useAuthStore()
const notify = useNotify()
const { extract } = useErrorMsg()
const { t } = useI18n()

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
    try {
      const { data } = await $axios.post<{ accessToken?: string; access_token?: string; user_id: string; is_new_user: boolean }>(
        '/auth/telegram-login',
        user,
      )
      const token = data.accessToken ?? data.access_token
      if (!token) {
        notify.error(t('common.somethingWentWrong'))
        return
      }
      accessToken.value = token
      if (data.is_new_user) {
        await navigateTo('/auth/role-select', { replace: true })
      } else {
        await authStore.fetchProfile(token)
        if (authStore.isAuthenticated) {
          await navigateTo(resolvePostLoginRoute(authStore.user?.role), { replace: true })
        } else {
          accessToken.value = null
          notify.error(t('common.somethingWentWrong'))
          await navigateTo('/auth/login', { replace: true })
        }
      }
    } catch (err) {
      notify.error(extract(err))
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
