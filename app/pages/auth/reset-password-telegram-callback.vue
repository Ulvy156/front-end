<template>
  <div class="min-h-dvh flex items-center justify-center bg-slate-50">
    <div class="flex flex-col items-center gap-y-3 text-slate-500 text-sm">
      <svg class="w-8 h-8 animate-spin text-emerald-600" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span>{{ t('auth.sending') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useErrorMsg } from '~/composables/useErrorMsg'
import { RESET_PASSWORD_CHANNEL } from '~/types/channel'
import { parseTelegramQueryField } from '~/utils/parseTelegramQueryField'

definePageMeta({ layout: 'auth' })

const { $axios } = useNuxtApp()
const notify = useNotify()
const { extract } = useErrorMsg()
const { t } = useI18n()
const route = useRoute()

// Same data-auth-url redirect pattern as `telegram-callback.vue` — see that
// file for why a top-level redirect is used instead of an in-page callback.
// Here the widget payload is forwarded to /auth/forgot-password instead of
// /auth/telegram-login, then the (still-valid) payload is carried forward as
// query params so the OTP step can reuse it for a resend.
onMounted(async () => {
  const { id, first_name, last_name, username, photo_url, auth_date, hash } = route.query

  if (!id || !first_name || !auth_date || !hash) {
    await navigateTo('/auth/reset-password', { replace: true })
    return
  }

  try {
    await $axios.post('/auth/forgot-password', {
      channel: RESET_PASSWORD_CHANNEL.TELEGRAM,
      telegram: {
        id: Number(id),
        first_name: String(first_name),
        last_name: parseTelegramQueryField(last_name),
        username: parseTelegramQueryField(username),
        photo_url: parseTelegramQueryField(photo_url),
        auth_date: Number(auth_date),
        hash: String(hash),
      },
    })
    await navigateTo({
      path: '/auth/reset-password',
      query: { channel: RESET_PASSWORD_CHANNEL.TELEGRAM, id, first_name, last_name, username, photo_url, auth_date, hash },
    }, { replace: true })
  } catch (err) {
    notify.error(extract(err))
    await navigateTo('/auth/reset-password', { replace: true })
  }
})
</script>
