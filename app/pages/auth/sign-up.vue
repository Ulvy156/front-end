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
                <h3 class="text-xl font-semibold text-slate-900">
                    {{ t('auth.createAcc') }}
                </h3>
                <p class="text-slate-500 text-sm">
                    {{ t('auth.createAccDec') }}
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
            <button type="button" class="w-full flex items-center justify-center gap-x-3
               rounded-xl border border-slate-200
               bg-white/80 py-3 font-medium text-slate-800
               hover:bg-white hover:shadow-sm transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
                    <defs>
                        <linearGradient id="SVGuySfwdaH" x1="50%" x2="50%" y1="0%" y2="100%">
                            <stop offset="0%" stop-color="#2aabee" />
                            <stop offset="100%" stop-color="#229ed9" />
                        </linearGradient>
                    </defs>
                    <path fill="url(#SVGuySfwdaH)"
                        d="M128 0C94.06 0 61.48 13.494 37.5 37.49A128.04 128.04 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51s-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0" />
                    <path fill="#fff"
                        d="M57.94 126.648q55.98-24.384 74.64-32.152c35.56-14.786 42.94-17.354 47.76-17.441c1.06-.017 3.42.245 4.96 1.49c1.28 1.05 1.64 2.47 1.82 3.467c.16.996.38 3.266.2 5.038c-1.92 20.24-10.26 69.356-14.5 92.026c-1.78 9.592-5.32 12.808-8.74 13.122c-7.44.684-13.08-4.912-20.28-9.63c-11.26-7.386-17.62-11.982-28.56-19.188c-12.64-8.328-4.44-12.906 2.76-20.386c1.88-1.958 34.64-31.748 35.26-34.45c.08-.338.16-1.598-.6-2.262c-.74-.666-1.84-.438-2.64-.258c-1.14.256-19.12 12.152-54 35.686c-5.1 3.508-9.72 5.218-13.88 5.128c-4.56-.098-13.36-2.584-19.9-4.708c-8-2.606-14.38-3.984-13.82-8.41c.28-2.304 3.46-4.662 9.52-7.072" />
                </svg>
                <span>{{ t('auth.telegram') }}</span>
            </button>

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
                    <BaseInput id="mail" size="large" :placeholder="t('auth.emailPlaceholder')" v-model="email">
                        <template >
                            <BaseIcon name="mail" />
                        </template>
                    </BaseInput>
                </div>

                <!-- Password -->
                <div>
                    <label for="password" class="text-sm font-medium text-slate-700">
                            {{ t('auth.password') }}
                        </label>

                    <BaseInput id="password" show-password type="password" size="large" :placeholder="t('auth.passwordPlaceholder')"
                        v-model="password">
                        <template >
                            <BaseIcon name="lock-keyhole" />
                        </template>
                    </BaseInput>
                </div>
            </div>

            <!-- Submit -->
            <button type="submit" class="w-full rounded-xl bg-blue-500 py-3
               font-semibold text-white
               hover:bg-blue-600 transition">
                {{ t('auth.signUp') }}
            </button>
            <div class="flex items-center gap-x-3">
                <span>{{ $t("auth.haveAccount") }}</span>
                <NuxtLink to="/auth/login" class="text-sm text-blue-500 font-semibold" >{{ $t("auth.signIn") }}</NuxtLink>
            </div>  
            <div class="flex">
                <span>{{ $t('auth.agreement') }}</span>
                &nbsp;
                <NuxtLink to="/auth/login" class="text-sm text-blue-500 font-semibold" >{{ $t("auth.terms") }}</NuxtLink>
                &nbsp;
                <NuxtLink to="/auth/login" class="text-sm text-blue-500 font-semibold" >{{ $t("auth.policy") }}</NuxtLink>
            </div>

        </form>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
    title: `${t('auth.welcome')} | Rentify`,
    description: t('auth.subtitle'),

    ogTitle: `${t('auth.welcome')} | Rentify`,
    ogDescription: t('auth.subtitle'),
    ogType: 'website',

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
