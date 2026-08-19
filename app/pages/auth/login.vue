<template>
    <AuthShell :title="t('auth.brandTitle')" :description="t('auth.brandDesc')" :features="brandFeatures">
        <el-form ref="formRef" :model="form" :rules="loginRules" @submit.prevent="submit"
            class="w-full max-w-90 space-y-5">

            <!-- Logo (mobile only) -->
            <NuxtLink to="/"
                class="animate-home-link hover:scale-105 active:scale-95 lg:hidden mb-2 mx-auto flex items-center gap-2 w-fit transition-transform duration-150">
                <NuxtImg src="/sabayrent-logo.webp" alt="SabayRent"
                    class="h-14 w-14 rounded-full object-cover ring-2 ring-offset-2 ring-offset-slate-50 ring-slate-200"
                    width="56" height="56" />
                <!-- <span class="text-xl font-semibold tracking-tight text-slate-900">SabayRent</span> -->
            </NuxtLink>

            <!-- Header -->
            <div class="space-y-1 text-center">
                <h2 class="text-2xl font-bold text-slate-900">{{ t('auth.welcome') }}</h2>
                <p class="text-slate-500 text-sm">{{ t('auth.subtitle') }}</p>
            </div>

            <!-- Social logins -->
            <AuthSocialLogins @google="loginWithGoogle" />

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
            <BaseButton native-type="submit" block size="large" :loading="isSubmitting"
                :label="isSubmitting ? t('auth.signingIn') : t('auth.signIn')" />

            <!-- Sign up -->
            <p class="text-center text-sm text-slate-500">
                {{ t('auth.noAccount') }}
                <NuxtLink to="/auth/sign-up"
                    class="ml-1 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                    {{ t('auth.signUp') }}
                </NuxtLink>
            </p>
        </el-form>
    </AuthShell>
</template>

<script setup lang="ts">
import AuthShell from '~/components/auth/AuthShell.vue'
import AuthSocialLogins from '~/components/auth/AuthSocialLogins.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import { useErrorMsg } from '~/composables/useErrorMsg'
import { useForm } from '~/composables/useForm'
import { useAuthFormRules } from '~/features/auth/composable/useAuthFormRules'
import { resolvePostLoginRoute } from '~/utils/roleGuard'
const { t } = useI18n()
const api = useApi()
const notify = useNotify()
const authStore = useAuthStore()
const { extract } = useErrorMsg()

const brandFeatures = computed(() => [
    { icon: 'map-pin', text: t('auth.brandFeature1') },
    { icon: 'message-circle', text: t('auth.brandFeature2') },
    { icon: 'heart', text: t('auth.brandFeature3') },
])

useSeoMeta({
    title: `${t('auth.welcome')} | SabayRent`,
    description: t('auth.subtitle'),
    ogTitle: `${t('auth.welcome')} | SabayRent`,
    ogDescription: t('auth.subtitle'),
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: `${t('auth.welcome')} | SabayRent`,
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
        await api.post('/auth/login', {
            identifier: form.identifier,
            password: form.password,
        })
        await authStore.fetchProfile()
        if (!authStore.isAuthenticated) {
            // fetchProfile failed silently (cookie rejected or backend issue)
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
        } else if (status === 403 && (msg.toLowerCase().includes('select a role') || msg.includes('សូមជ្រើសរើសតួនាទីមុននឹងចូលប្រើប្រាស់'))) {
            notify.info(msg)
            await navigateTo('/auth/role-select')
        } else {
            notify.error(msg)
        }
    }
})
</script>
