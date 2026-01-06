<template>
    <!-- PAGE BACKGROUND -->
    <section class="min-h-dvh flex items-center justify-center px-4
           bg-linear-to-br from-slate-200 via-slate-100 to-slate-200">
        <!-- GLASS CARD -->
        <form class="w-full max-w-md
             bg-white/70 backdrop-blur-xl
             border border-white/60
             shadow-[0_25px_50px_-15px_rgba(0,0,0,0.25)]
             rounded-2xl p-6
             flex flex-col items-center gap-y-6">
            <!-- Header -->
            <div class="text-center space-y-1">
                <h3 class="text-xl text-slate-900">
                    {{ t('auth.welcome') }}
                </h3>
                <p class="text-slate-500 text-sm">
                    {{ t('auth.subtitle') }}
                </p>
            </div>

            <!-- Google -->
            <button type="button" class="w-full flex items-center justify-center gap-x-3
               rounded-xl border border-slate-200
               bg-white/80 py-3 font-medium text-slate-800
               hover:bg-white hover:shadow-sm transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
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

            <!-- Telegram -->
            <telegramLogin/>

            <!-- Divider -->
            <div class="flex items-center w-full gap-x-3 text-sm text-slate-400">
                <span class="flex-1 h-px bg-slate-200"></span>
                {{ t('auth.or') }}
                <span class="flex-1 h-px bg-slate-200"></span>
            </div>

            <!-- Manual login -->
            <div class="grid grid-cols-1 w-full gap-y-4">
                <!-- Email -->
                <div>
                    <label for="mail" class="text-sm font-medium text-slate-700">
                        {{ t('auth.email') }}
                    </label>
                    <BaseInput icon="mail" id="mail" size="large" :placeholder="t('auth.emailPlaceholder')"
                        v-model="email" />

                </div>

                <!-- Password -->
                <div>
                    <div class="flex justify-between items-center">
                        <label for="password" class="text-sm font-medium text-slate-700">
                            {{ t('auth.password') }}
                        </label>
                        <NuxtLink to="/auth/reset-password" class="text-blue-500 font-semibold text-sm">
                            {{ t('auth.forgot') }}
                        </NuxtLink>
                    </div>

                    <BaseInput id="password" icon="lock-keyhole" show-password type="password" size="large"
                        :placeholder="t('auth.passwordPlaceholder')" v-model="password" />
                </div>
            </div>

            <!-- Submit -->
            <button type="submit" class="w-full rounded-xl bg-blue-500 py-3
               font-semibold text-white
               hover:bg-blue-600 transition">
                {{ t('auth.signIn') }}
            </button>
            <div class="flex items-center gap-x-3">
                <span>{{ $t("auth.haveAccount") }}</span>
                <NuxtLink to="/auth/sign-up" class="text-sm text-blue-500 font-semibold">{{ $t("auth.signUp") }}
                </NuxtLink>
            </div>
        </form>
    </section>
</template>

<script setup lang="ts">
import telegramLogin from '~/components/auth/telegram-login.client.vue'
const { t } = useI18n()

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
definePageMeta({
    layout: 'auth'
})
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'

const email = ref('')
const password = ref('')

const submit = () => {
    console.log({ email: email.value, password: password.value })
}
</script>
