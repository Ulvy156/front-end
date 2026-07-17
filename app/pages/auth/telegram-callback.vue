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
import { useErrorMsg } from '~/composables/useErrorMsg'
import { resolvePostLoginRoute } from '~/utils/roleGuard'

definePageMeta({ layout: 'auth' })

const route = useRoute()
const api = useApi()
const accessToken = useAccessToken()
const hasSession = useHasSession()
const authStore = useAuthStore()
const notify = useNotify()
const { extract } = useErrorMsg()
const { t } = useI18n()

onMounted(async () => {
  const { id, hash } = route.query
  if (!id || !hash) {
    await navigateTo('/auth/login', { replace: true })
    return
  }

  const payload = {
    id: route.query.id,
    first_name: route.query.first_name,
    last_name: route.query.last_name,
    username: route.query.username,
    photo_url: route.query.photo_url,
    auth_date: route.query.auth_date,
    hash: route.query.hash,
  }

  try {
    const { data } = await api.post<{ accessToken?: string; access_token?: string; is_new_user: boolean }>(
      '/auth/telegram-login',
      payload,
    )
    const token = data.accessToken ?? data.access_token
    if (!token) {
      notify.error(t('common.somethingWentWrong'))
      await navigateTo('/auth/login', { replace: true })
      return
    }
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
        notify.error(t('common.somethingWentWrong'))
        await navigateTo('/auth/login', { replace: true })
      }
    }
  } catch (err) {
    notify.error(extract(err))
    await navigateTo('/auth/login', { replace: true })
  }
})
</script>
