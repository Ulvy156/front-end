<template>
    <section class="min-h-dvh flex items-stretch">

        <!-- Brand Panel (desktop left) -->
        <div class="hidden lg:flex lg:w-5/12 xl:w-[45%] relative overflow-hidden
                    flex-col justify-between p-12
                    bg-linear-to-br from-blue-600 via-blue-500 to-indigo-600 text-white">

            <div class="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div class="absolute -bottom-10 -right-10 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none" />

            <NuxtLink to="/" class="relative z-10 flex items-center gap-x-2.5 w-fit">
                <div class="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                </div>
                <span class="text-xl font-bold tracking-tight">Rentify</span>
            </NuxtLink>

            <div class="relative z-10 space-y-8">
                <div class="space-y-4">
                    <h1 class="text-4xl font-bold leading-tight">{{ t('auth.brandTitle') }}</h1>
                    <p class="text-blue-100 text-base leading-relaxed max-w-xs">
                        {{ t('auth.brandDesc') }}
                    </p>
                </div>

                <ul class="space-y-3.5">
                    <li v-for="item in brandFeatures" :key="item" class="flex items-center gap-x-3 text-blue-50">
                        <div class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                            <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke="white" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                        <span class="text-sm">{{ item }}</span>
                    </li>
                </ul>
            </div>

            <p class="relative z-10 text-blue-200/80 text-xs">
                {{ t('auth.agreement') }}
            </p>
        </div>

        <!-- Form Panel -->
        <div class="flex-1 flex items-center justify-center bg-slate-50 px-6 py-14">
            <el-form ref="formRef" :model="form" :rules="loginRules" @submit.prevent="submit"
                class="w-full max-w-[360px] space-y-5">

                <!-- Logo (mobile only) -->
                <NuxtLink to="/" class="lg:hidden flex items-center gap-x-2 mb-2 mx-auto w-fit">
                    <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                            stroke-linejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </div>
                    <span class="font-bold text-slate-800 text-lg">Rentify</span>
                </NuxtLink>

                <!-- Header -->
                <div class="space-y-1">
                    <h2 class="text-2xl font-bold text-slate-900">{{ t('auth.welcome') }}</h2>
                    <p class="text-slate-500 text-sm">{{ t('auth.subtitle') }}</p>
                </div>

                <!-- Social logins -->
                <div class="space-y-3">
                    <button type="button" @click="loginWithGoogle" class="w-full flex items-center justify-center gap-x-3
                           rounded-xl border border-slate-200 bg-white
                           py-2.5 font-medium text-slate-700 text-sm
                           hover:border-slate-300 hover:shadow-sm
                           active:scale-[0.99] transition-all duration-150 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
                            <path fill="#ffc107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917" />
                            <path fill="#ff3d00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691" />
                            <path fill="#4caf50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44" />
                            <path fill="#1976d2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917" />
                        </svg>
                        <span>{{ t('auth.google') }}</span>
                    </button>

                    <div class="flex justify-center">
                        <telegramLogin />
                    </div>
                </div>

                <!-- Divider -->
                <div class="flex items-center gap-x-3">
                    <span class="flex-1 h-px bg-slate-200" />
                    <span class="text-xs text-slate-400 font-medium">{{ t('auth.or') }}</span>
                    <span class="flex-1 h-px bg-slate-200" />
                </div>

                <!-- Fields -->
                <div class="space-y-4">
                    <div class="space-y-1.5">
                        <label for="identifier" class="block text-sm font-medium text-slate-700">
                            {{ t('auth.identifier') }}
                        </label>
                        <el-form-item prop="identifier" :style="{ marginBottom: 0 }">
                            <BaseInput icon="mail" id="identifier" size="large"
                                :placeholder="t('auth.identifierPlaceholder')"
                                v-model="form.identifier" />
                        </el-form-item>
                    </div>

                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between">
                            <label for="password" class="text-sm font-medium text-slate-700">
                                {{ t('auth.password') }}
                            </label>
                            <NuxtLink to="/auth/reset-password"
                                class="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                {{ t('auth.forgot') }}
                            </NuxtLink>
                        </div>
                        <el-form-item prop="password" :style="{ marginBottom: 0 }">
                            <BaseInput id="password" icon="lock-keyhole" show-password type="password"
                                size="large" :placeholder="t('auth.passwordPlaceholder')"
                                v-model="form.password" />
                        </el-form-item>
                    </div>
                </div>

                <!-- Submit -->
                <button type="submit" :disabled="isSubmitting"
                    class="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white
                           hover:bg-blue-700 active:scale-[0.99]
                           shadow-sm shadow-blue-200/60
                           transition-all duration-150 cursor-pointer
                           disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100">
                    <span v-if="isSubmitting" class="flex items-center justify-center gap-x-2">
                        <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {{ t('auth.signingIn') }}
                    </span>
                    <span v-else>{{ t('auth.signIn') }}</span>
                </button>

                <!-- Sign up -->
                <p class="text-center text-sm text-slate-500">
                    {{ t('auth.noAccount') }}
                    <NuxtLink to="/auth/sign-up"
                        class="ml-1 font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        {{ t('auth.signUp') }}
                    </NuxtLink>
                </p>

            </el-form>
        </div>
    </section>
</template>

<script setup lang="ts">
import telegramLogin from '~/components/auth/telegram-login.client.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import { useErrorMsg } from '~/composables/useErrorMsg'
import { useForm } from '~/composables/useForm'
import { useAuthFormRules } from '~/features/auth/composable/useAuthFormRules'
import { setCookie } from '#imports'
const { t } = useI18n()
const api = useApi()
const notify = useNotify()
const authStore = useAuthStore()
const accessToken = useAccessToken()
const config = useRuntimeConfig()
const { extract } = useErrorMsg()

const brandFeatures = computed(() => [
    t('auth.brandFeature1'),
    t('auth.brandFeature2'),
    t('auth.brandFeature3'),
])

useSeoMeta({
    title: `${t('auth.welcome')} | Rentify`,
    description: t('auth.subtitle'),
    ogTitle: `${t('auth.welcome')} | Rentify`,
    ogDescription: t('auth.subtitle'),
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: `${t('auth.welcome')} | Rentify`,
    twitterDescription: t('auth.subtitle'),
    robots: 'noindex, nofollow',
})

definePageMeta({ layout: 'auth' })

const { loginRules } = useAuthFormRules()
const { formRef, form, rules, isSubmitting, handleSubmit } = useForm(
    { identifier: '', password: '' },
    loginRules,
)

const loginWithGoogle = () => {
    window.location.href = `${config.public.apiBaseUrl}/auth/google`
}

const submit = handleSubmit(async () => {
    try {
        const { data } = await api.post<{ accessToken?: string; access_token?: string; user_id: string }>('/auth/login', {
            identifier: form.identifier,
            password: form.password,
        })
        const token = data.accessToken

        setCookie('access_token', token);
        if (!token) {
            notify.error(t('common.somethingWentWrong'))
            return
        }
        accessToken.value = token
        await authStore.fetchProfile()
        if (!authStore.isAuthenticated) {
            // fetchProfile failed silently (token rejected or backend issue)
            accessToken.value = null
            notify.error(t('common.somethingWentWrong'))
            return
        }
        await navigateTo('/', { replace: true })
    } catch (err) {
        const status = (err as { response?: { status?: number } })?.response?.status
        const msg = extract(err)
        if (status === 403 && (msg.toLowerCase().includes('not verified') || msg.includes('ផ្ទៀងផ្ទាត់'))) {
            notify.info(msg)
            await navigateTo(`/auth/verify?email=${encodeURIComponent(form.identifier)}`)
        } else {
            notify.error(msg)
        }
    }
})
</script>
