<template>
  <section class="min-h-dvh flex items-center justify-center bg-slate-50 px-6 py-14">
    <div class="w-full max-w-105 space-y-8">

      <!-- Logo -->
      <NuxtLink to="/" class="mx-auto w-fit">
        <NuxtImg src="/rokpteah-logo.webp" alt="RokPteah" class="h-9" width="36" height="36" />
      </NuxtLink>

      <!-- Header -->
      <div class="text-center space-y-2">
        <h1 class="text-2xl font-bold text-slate-900">{{ t('auth.selectRoleTitle') }}</h1>
        <p class="text-slate-500 text-sm">{{ t('auth.selectRoleDesc') }}</p>
      </div>

      <!-- Optional password setup (new Telegram/Google sign-ups only) -->
      <div v-if="showPasswordField" class="space-y-1.5">
        <label for="password" class="block text-sm font-medium text-slate-700">
          {{ t('auth.setPassword') }}
        </label>
        <BaseInput id="password" icon="lock-keyhole" show-password type="password" size="large"
          :disabled="isSubmitting" :placeholder="t('auth.setPasswordPlaceholder')" v-model="password" />
        <p v-if="passwordError" class="text-xs text-red-500">{{ passwordError }}</p>
        <p class="text-xs text-slate-400">{{ t('auth.setPasswordDesc') }}</p>
      </div>

      <!-- Role cards -->
      <div class="grid grid-cols-2 gap-4">
        <button type="button" :disabled="isSubmitting" @click="selectRole('USER')"
          class="group flex flex-col items-center gap-y-3 rounded-2xl border-2 p-6
                 border-slate-200 bg-white text-slate-600
                 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700
                 active:scale-[0.98] transition-all duration-150 cursor-pointer
                 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100">
          <div class="w-12 h-12 rounded-xl bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center transition-colors duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-600" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
          <div class="text-center space-y-1">
            <p class="font-semibold text-sm">{{ t('auth.roleUserLabel') }}</p>
            <p class="text-xs text-slate-400 group-hover:text-emerald-500 transition-colors duration-150">
              {{ t('auth.roleUserDesc') }}
            </p>
          </div>
        </button>

        <button type="button" :disabled="isSubmitting" @click="selectRole('LANDLORD')"
          class="group flex flex-col items-center gap-y-3 rounded-2xl border-2 p-6
                 border-slate-200 bg-white text-slate-600
                 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700
                 active:scale-[0.98] transition-all duration-150 cursor-pointer
                 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100">
          <div class="w-12 h-12 rounded-xl bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center transition-colors duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-600" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div class="text-center space-y-1">
            <p class="font-semibold text-sm">{{ t('auth.roleLandlordLabel') }}</p>
            <p class="text-xs text-slate-400 group-hover:text-emerald-500 transition-colors duration-150">
              {{ t('auth.roleLandlordDesc') }}
            </p>
          </div>
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="isSubmitting" class="flex items-center justify-center gap-x-2 text-slate-500 text-sm">
        <svg class="w-4 h-4 animate-spin text-emerald-600" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {{ t('auth.savingRole') }}
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import BaseInput from '~/components/ui/BaseInput.vue'
import { resolvePostLoginRoute } from '~/utils/roleGuard'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const api = useApi()
const notify = useNotify()
const authStore = useAuthStore()
const { extract } = useErrorMsg()
const route = useRoute()

// Only new Telegram/Google sign-ups lack a password; existing accounts already
// have one and the backend rejects select-role if a password is sent for them.
const showPasswordField = route.query.is_new_user === 'true'

const password = ref('')
const passwordError = ref('')
const isSubmitting = ref(false)

watch(password, () => { passwordError.value = '' })

const selectRole = async (role: 'USER' | 'LANDLORD') => {
  const trimmedPassword = password.value.trim()
  if (showPasswordField && trimmedPassword && !isStrongPassword(trimmedPassword)) {
    passwordError.value = t('auth.passwordWeak')
    return
  }

  isSubmitting.value = true
  try {
    await api.patch('/auth/select-role', {
      role,
      ...(showPasswordField && trimmedPassword ? { password: trimmedPassword } : {}),
    })
    // select-role changes the role baked into the JWT, so a fresh access
    // token (fresh cookie) is needed to reflect it going forward.
    await api.post('/auth/refresh-token')
    await authStore.fetchProfile()
    await navigateTo(resolvePostLoginRoute(authStore.user?.role), { replace: true })
  } catch (err) {
    notify.error(extract(err))
  } finally {
    isSubmitting.value = false
  }
}
</script>
