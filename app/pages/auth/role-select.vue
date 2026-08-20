<template>
  <section class="min-h-dvh flex items-center justify-center bg-slate-50 px-6 py-14">
    <div class="w-full max-w-105 space-y-8">

      <!-- Logo -->
      <NuxtLink to="/" class="flex w-fit mx-auto">
        <NuxtImg src="/sabayrent-logo.webp" alt="SabayRent" class="h-9" width="36" height="36" />
      </NuxtLink>

      <!-- Header -->
      <div class="text-center space-y-2">
        <h1 class="text-2xl font-bold text-slate-900">{{ t('auth.selectRoleTitle') }}</h1>
        <p class="text-slate-500 text-sm">{{ t('auth.selectRoleDesc') }}</p>
      </div>

      <!-- Password setup (new Telegram/Google sign-ups only) -->
      <div v-if="showPasswordField" class="space-y-1.5">
        <label for="password" class="block text-sm font-medium text-slate-700">
          {{ t('auth.setPassword') }} <span class="text-red-500">*</span>
        </label>
        <BaseInput id="password" icon="lock-keyhole" show-password type="password" size="large"
          :disabled="isSubmitting" :placeholder="t('auth.setPasswordPlaceholder')" v-model="password" />
        <p v-if="passwordError" class="text-xs text-red-500">{{ passwordError }}</p>
        <p class="text-xs text-slate-400">{{ t('auth.setPasswordDesc') }}</p>
      </div>

      <!-- Role cards -->
      <div class="space-y-2">
        <p class="text-sm font-medium text-slate-700">
          {{ t('auth.selectRoleLabel') }} <span class="text-red-500">*</span>
        </p>
        <div class="grid grid-cols-2 gap-4">
          <button type="button" :disabled="isSubmitting" @click="selectedRole = 'USER'"
            :aria-pressed="selectedRole === 'USER'"
            class="group relative flex flex-col items-center gap-y-3 rounded-2xl border-2 p-6
                   transition-all duration-150 cursor-pointer
                   active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100"
            :class="selectedRole === 'USER'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 disabled:opacity-100'
              : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-60'">
            <svg v-if="selectedRole === 'USER'" xmlns="http://www.w3.org/2000/svg"
              class="absolute top-3 right-3 w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.7 7.7-5.4 5.4a1 1 0 01-1.4 0l-2.6-2.6a1 1 0 111.4-1.4l1.9 1.9 4.7-4.7a1 1 0 111.4 1.4z" />
            </svg>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-150"
              :class="selectedRole === 'USER' ? 'bg-emerald-200' : 'bg-emerald-100 group-hover:bg-emerald-200'">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-600" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <div class="text-center space-y-1">
              <p class="font-semibold text-sm">{{ t('auth.roleUserLabel') }}</p>
              <p class="text-xs transition-colors duration-150"
                :class="selectedRole === 'USER' ? 'text-emerald-500' : 'text-slate-400 group-hover:text-emerald-500'">
                {{ t('auth.roleUserDesc') }}
              </p>
            </div>
          </button>

          <button type="button" :disabled="isSubmitting" @click="selectedRole = 'LANDLORD'"
            :aria-pressed="selectedRole === 'LANDLORD'"
            class="group relative flex flex-col items-center gap-y-3 rounded-2xl border-2 p-6
                   transition-all duration-150 cursor-pointer
                   active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100"
            :class="selectedRole === 'LANDLORD'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 disabled:opacity-100'
              : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-60'">
            <svg v-if="selectedRole === 'LANDLORD'" xmlns="http://www.w3.org/2000/svg"
              class="absolute top-3 right-3 w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.7 7.7-5.4 5.4a1 1 0 01-1.4 0l-2.6-2.6a1 1 0 111.4-1.4l1.9 1.9 4.7-4.7a1 1 0 111.4 1.4z" />
            </svg>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-150"
              :class="selectedRole === 'LANDLORD' ? 'bg-emerald-200' : 'bg-emerald-100 group-hover:bg-emerald-200'">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-600" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div class="text-center space-y-1">
              <p class="font-semibold text-sm">{{ t('auth.roleLandlordLabel') }}</p>
              <p class="text-xs transition-colors duration-150"
                :class="selectedRole === 'LANDLORD' ? 'text-emerald-500' : 'text-slate-400 group-hover:text-emerald-500'">
                {{ t('auth.roleLandlordDesc') }}
              </p>
            </div>
          </button>
        </div>
      </div>

      <!-- Continue -->
      <BaseButton block size="large" :disabled="!selectedRole" :loading="isSubmitting"
        :label="isSubmitting ? t('auth.savingRole') : t('auth.continue')" @click="submit" />

    </div>
  </section>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import { resolvePostLoginRoute } from '~/utils/roleGuard'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const api = useApi()
const notify = useNotify()
const authStore = useAuthStore()
const { extract, extractCode } = useErrorMsg()
const route = useRoute()

// Only new Telegram/Google sign-ups lack a password; existing accounts already
// have one and the backend rejects select-role if a password is sent for them.
const showPasswordField = route.query.is_new_user === 'true'

const password = ref('')
const passwordError = ref('')
const isSubmitting = ref(false)
const selectedRole = ref<'USER' | 'LANDLORD' | null>(null)

watch(password, () => { passwordError.value = '' })

const submit = async () => {
  const role = selectedRole.value
  if (!role) return

  const trimmedPassword = password.value.trim()
  if (showPasswordField) {
    if (!trimmedPassword) {
      passwordError.value = t('auth.passwordRequired')
      return
    }
    if (!isStrongPassword(trimmedPassword)) {
      passwordError.value = t('auth.passwordWeak')
      return
    }
  }

  isSubmitting.value = true
  try {
    await api.patch('/auth/select-role', {
      role,
      ...(showPasswordField ? { password: trimmedPassword } : {}),
    })
    // select-role changes the role baked into the JWT, so a fresh access
    // token (fresh cookie) is needed to reflect it going forward.
    await api.post('/auth/refresh-token')
    await authStore.fetchProfile()
    await navigateTo(resolvePostLoginRoute(authStore.user?.role), { replace: true })
  } catch (err) {
    const code = extractCode(err)
    // Guards against double-submits: the account already has a role and/or
    // password set, so treat this as already-onboarded and route in rather
    // than error.
    if (code === 'role_already_set' || code === 'password_already_set') {
      notify.info(t('auth.roleAlreadySelected'))
      await api.post('/auth/refresh-token')
      await authStore.fetchProfile()
      await navigateTo(resolvePostLoginRoute(authStore.user?.role), { replace: true })
    } else {
      notify.error(extract(err))
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
