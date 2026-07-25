<template>
    <div v-if="!appSettingsStore.registrationEnabled" class="w-full max-w-[360px] space-y-5 text-center">
        <NuxtLink to="/"
            class="animate-home-link hover:scale-105 active:scale-95 lg:hidden mb-2 mx-auto flex items-center justify-center w-fit transition-transform duration-150">
            <NuxtImg src="/rokpteah-logo.webp" alt="RokPteah"
                class="h-14 w-14 rounded-full object-cover ring-2 ring-offset-2 ring-offset-slate-50 ring-slate-200"
                width="56" height="56" />
        </NuxtLink>

        <div class="rounded-xl border border-amber-200 bg-amber-50 p-5 space-y-1.5">
            <h2 class="text-lg font-bold text-amber-800">{{ t('auth.registrationClosedTitle') }}</h2>
            <p class="text-sm text-amber-700">{{ t('auth.registrationClosedDesc') }}</p>
        </div>

        <p class="text-center text-sm text-slate-500">
            {{ t('auth.haveAccount') }}
            <NuxtLink to="/auth/login"
                class="ml-1 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                {{ t('auth.signIn') }}
            </NuxtLink>
        </p>
    </div>

    <el-form v-else ref="formRef" :model="form" :rules="rules" @submit.prevent="submit"
        class="w-full max-w-[360px] space-y-5">

        <!-- Logo (mobile only) -->
        <NuxtLink to="/"
            class="animate-home-link hover:scale-105 active:scale-95 lg:hidden mb-2 mx-auto flex items-center justify-center w-fit transition-transform duration-150">
            <NuxtImg src="/rokpteah-logo.webp" alt="RokPteah"
                class="h-14 w-14 rounded-full object-cover ring-2 ring-offset-2 ring-offset-slate-50 ring-slate-200"
                width="56" height="56" />
        </NuxtLink>

        <!-- Header -->
        <div class="space-y-1">
            <h2 class="text-2xl font-bold text-slate-900">{{ t('auth.createAccount') }}</h2>
            <p class="text-slate-500 text-sm">{{ t('auth.createAccountDesc') }}</p>
        </div>

        <!-- Social logins -->
        <div class="space-y-3">
            <button type="button" @click="loginWithGoogle" class="w-full flex items-center justify-center gap-x-3
                   rounded-xl border border-slate-200 bg-white
                   py-2.5 font-medium text-slate-700 text-sm
                   hover:border-slate-300 hover:shadow-sm
                   active:scale-[0.99] transition-all duration-150 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#ffc107"
                        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917" />
                    <path fill="#ff3d00"
                        d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691" />
                    <path fill="#4caf50"
                        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44" />
                    <path fill="#1976d2"
                        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917" />
                </svg>
                <span>{{ t('auth.google') }}</span>
            </button>

            <telegramLogin />
        </div>

        <!-- Divider -->
        <div class="flex items-center gap-x-3">
            <span class="flex-1 h-px bg-slate-200" />
            <span class="text-xs text-slate-400 font-medium">{{ t('auth.orSignUpEmail') }}</span>
            <span class="flex-1 h-px bg-slate-200" />
        </div>

        <!-- Fields -->
        <div class="space-y-4">
            <!-- Name -->
            <div class="space-y-1.5">
                <label for="name" class="block text-sm font-medium text-slate-700">
                    {{ t('auth.name') }}
                </label>
                <el-form-item prop="name" :style="{ marginBottom: 0 }">
                    <BaseInput icon="user" id="name" size="large"
                        :placeholder="t('auth.namePlaceholder')" v-model="form.name" />
                </el-form-item>
            </div>

            <!-- Email -->
            <div class="space-y-1.5">
                <label for="mail" class="block text-sm font-medium text-slate-700">
                    {{ t('auth.email') }}
                </label>
                <el-form-item prop="email" :style="{ marginBottom: 0 }">
                    <BaseInput icon="mail" id="mail" size="large"
                        :placeholder="t('auth.emailPlaceholder')" v-model="form.email" />
                </el-form-item>
            </div>

            <!-- Password -->
            <div class="space-y-1.5">
                <label for="password" class="block text-sm font-medium text-slate-700">
                    {{ t('auth.password') }}
                </label>
                <el-form-item prop="password" :style="{ marginBottom: 0 }">
                    <BaseInput id="password" icon="lock-keyhole" show-password type="password"
                        size="large" :placeholder="t('auth.passwordPlaceholder')" v-model="form.password" />
                </el-form-item>
            </div>

            <!-- Phone (optional) -->
            <div class="space-y-1.5">
                <label for="phone" class="block text-sm font-medium text-slate-700">
                    {{ t('auth.phone') }}
                </label>
                <el-form-item prop="phone" :style="{ marginBottom: 0 }">
                    <BaseInput icon="phone" id="phone" size="large"
                        :placeholder="t('auth.phonePlaceholder')" v-model="form.phone" />
                </el-form-item>
            </div>

            <!-- Role -->
            <div class="space-y-1.5">
                <span class="block text-sm font-medium text-slate-700">{{ t('auth.iAmA') }}</span>
                <div class="grid grid-cols-2 gap-3">
                    <button type="button" @click="role = 'USER'"
                        :class="role === 'USER'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
                        class="flex flex-col items-center gap-y-1.5 rounded-xl border-2 p-3
                               text-sm font-medium transition-all duration-150 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                        {{ t('auth.roleTenant') }}
                    </button>
                    <button type="button" @click="role = 'LANDLORD'"
                        :class="role === 'LANDLORD'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
                        class="flex flex-col items-center gap-y-1.5 rounded-xl border-2 p-3
                               text-sm font-medium transition-all duration-150 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        {{ t('auth.roleLandlord') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Submit -->
        <button type="submit" :disabled="isSubmitting"
            class="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white
                   hover:bg-emerald-700 active:scale-[0.99] shadow-sm shadow-emerald-200/60
                   transition-all duration-150 cursor-pointer
                   disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100">
            <span v-if="isSubmitting" class="flex items-center justify-center gap-x-2">
                <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {{ t('auth.creating') }}
            </span>
            <span v-else>{{ t('auth.signUp') }}</span>
        </button>

        <!-- Sign in -->
        <p class="text-center text-sm text-slate-500">
            {{ t('auth.haveAccount') }}
            <NuxtLink to="/auth/login"
                class="ml-1 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                {{ t('auth.signIn') }}
            </NuxtLink>
        </p>
    </el-form>
</template>

<script setup lang="ts">
import telegramLogin from '~/components/auth/telegram-login.client.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import { useAuthFormRules } from '~/features/auth/composable/useAuthFormRules'
import { useAppSettingsStore } from '~/stores/appSettings'

export interface RegisterPayload {
    name: string
    email: string
    password: string
    role: 'USER' | 'LANDLORD'
    phone?: string
}

const emit = defineEmits<{ registered: [email: string, payload: RegisterPayload] }>()

const { t } = useI18n()
const api = useApi()
const notify = useNotify()
const { extract } = useErrorMsg()
const appSettingsStore = useAppSettingsStore()

const { registerRules } = useAuthFormRules()
const { formRef, form, rules, isSubmitting, handleSubmit, setFieldError } = useForm(
    { name: '', email: '', password: '', phone: '' },
    registerRules,
)

const role = ref<'USER' | 'LANDLORD'>('USER')

const loginWithGoogle = () => {
    // Routed through the /api proxy (see routeRules in nuxt.config.ts) so the
    // OAuth callback's Set-Cookie lands on this same origin, not onrender.com.
    window.location.href = '/api/auth/google'
}

const submit = handleSubmit(async () => {
    try {
        const payload: RegisterPayload = {
            name: form.name.trim(),
            email: form.email,
            password: form.password,
            role: role.value,
            ...(form.phone.trim() ? { phone: normalizePhoneNumber(form.phone) } : {}),
        }
        await api.post('/auth/register', payload)
        emit('registered', form.email, payload)
    } catch (err) {
        const status = (err as { response?: { status?: number } })?.response?.status
        if (status === 409) {
            notify.info(extract(err))
            await navigateTo('/auth/login')
        } else if (status === 400) {
            setFieldError('email', extract(err))
        } else {
            notify.error(extract(err))
        }
    }
})
</script>
