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
import { useErrorMsg } from '~/composables/useErrorMsg'
import { parseTelegramQueryField } from '~/utils/parseTelegramQueryField'

definePageMeta({ layout: 'auth' })

const { $axios } = useNuxtApp()
const authStore = useAuthStore()
const notify = useNotify()
const { extract } = useErrorMsg()
const { t } = useI18n()
const route = useRoute()

// Telegram's data-auth-url mode redirects here as a plain top-level
// navigation with the widget's auth fields as query params, instead of the
// widget injecting an inline <script> to call a page-level callback (which
// `script-src` without 'unsafe-inline' blocks). The query params are the
// exact fields Telegram's onTelegramAuth(user) callback would have received,
// just as strings — reshape and forward to the same endpoint.
onMounted(async () => {
  const { id, first_name, last_name, username, photo_url, auth_date, hash } = route.query

  if (!id || !first_name || !auth_date || !hash) {
    await navigateTo('/auth/login', { replace: true })
    return
  }

  try {
    const { data } = await $axios.post<{ user_id: string; is_new_user: boolean }>(
      '/auth/telegram-login',
      {
        id: Number(id),
        first_name: String(first_name),
        last_name: parseTelegramQueryField(last_name),
        username: parseTelegramQueryField(username),
        photo_url: parseTelegramQueryField(photo_url),
        auth_date: Number(auth_date),
        hash: String(hash),
      },
    )
    if (data.is_new_user) {
      await navigateTo({ path: '/auth/role-select', query: { is_new_user: 'true' } }, { replace: true })
      return
    }
    await authStore.fetchProfile()
    if (authStore.isAuthenticated) {
      await navigateTo(resolvePostLoginRoute(authStore.user?.role), { replace: true })
    } else {
      notify.error(t('common.somethingWentWrong'))
      await navigateTo('/auth/login', { replace: true })
    }
  } catch (err) {
    notify.error(extract(err))
    await navigateTo('/auth/login', { replace: true })
  }
})
</script>
