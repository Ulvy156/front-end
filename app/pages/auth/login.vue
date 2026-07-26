<template>
    <section class="min-h-dvh flex items-stretch">

        <AuthBrandPanel :title="t('auth.brandTitle')" :description="t('auth.brandDesc')" :features="brandFeatures" />

        <!-- Form Panel -->
        <div class="flex-1 flex items-center justify-center bg-slate-50 px-6 py-14">
            <el-form ref="formRef" :model="form" :rules="loginRules" @submit.prevent="submit"
                class="w-full max-w-[360px] space-y-5">

                <!-- Logo (mobile only) -->
                <NuxtLink to="/"
                    class="animate-home-link hover:scale-105 active:scale-95 lg:hidden mb-2 mx-auto flex items-center gap-2 w-fit transition-transform duration-150">
                    <NuxtImg src="/rokpteah-logo.webp" alt="RokPteah"
                        class="h-14 w-14 rounded-full object-cover ring-2 ring-offset-2 ring-offset-slate-50 ring-slate-200"
                        width="56" height="56" />
                    <!-- <span class="text-xl font-semibold tracking-tight text-slate-900">RokPteah</span> -->
                </NuxtLink>

                <!-- Header -->
                <div class="space-y-1 text-center">
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

                    <telegramLogin />
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
                                class="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
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
                    class="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white
                           hover:bg-emerald-700 active:scale-[0.99]
                           shadow-sm shadow-emerald-200/60
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
                        class="ml-1 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                        {{ t('auth.signUp') }}
                    </NuxtLink>
                </p>

            </el-form>
        </div>
    </section>
</template>

<script setup lang="ts">
import AuthBrandPanel from '~/components/auth/AuthBrandPanel.vue'
import telegramLogin from '~/components/auth/telegram-login.client.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import { useErrorMsg } from '~/composables/useErrorMsg'
import { useForm } from '~/composables/useForm'
import { useAuthFormRules } from '~/features/auth/composable/useAuthFormRules'
import { resolvePostLoginRoute } from '~/utils/roleGuard'
const { t } = useI18n()
const api = useApi()
const notify = useNotify()
const authStore = useAuthStore()
const accessToken = useAccessToken()
const { extract } = useErrorMsg()

const brandFeatures = computed(() => [
    { icon: 'map-pin', text: t('auth.brandFeature1') },
    { icon: 'message-circle', text: t('auth.brandFeature2') },
    { icon: 'heart', text: t('auth.brandFeature3') },
])

useSeoMeta({
    title: `${t('auth.welcome')} | RokPteah`,
    description: t('auth.subtitle'),
    ogTitle: `${t('auth.welcome')} | RokPteah`,
    ogDescription: t('auth.subtitle'),
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: `${t('auth.welcome')} | RokPteah`,
    twitterDescription: t('auth.subtitle'),
    robots: 'noindex, nofollow',
})

definePageMeta({ layout: 'auth', middleware: 'guest' })

const { loginRules } = useAuthFormRules()
const { formRef, form, rules, isSubmitting, handleSubmit } = useForm(
    { identifier: '', password: '' },
    loginRules,
)

const loginWithGoogle = () => {
    // Routed through the /api proxy (see routeRules in nuxt.config.ts) so the
    // OAuth callback's Set-Cookie lands on this same origin, not onrender.com.
    window.location.href = '/api/auth/google'
}

const submit = handleSubmit(async () => {
    try {
        const { data } = await api.post<{ accessToken: string }>('/auth/login', {
            identifier: form.identifier,
            password: form.password,
        })
        const token = data.accessToken
        if (!token) {
            notify.error(t('common.somethingWentWrong'))
            return
        }
        accessToken.value = token
        await authStore.fetchProfile(token)
        if (!authStore.isAuthenticated) {
            // fetchProfile failed silently (token rejected or backend issue)
            accessToken.value = null
            notify.error(t('common.somethingWentWrong'))
            return
        }
        await navigateTo(resolvePostLoginRoute(authStore.user?.role), { replace: true })
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
