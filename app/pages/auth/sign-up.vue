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
                    <h1 class="text-4xl font-bold leading-tight">
                        {{ step === 1 ? 'Join thousands of renters in Cambodia' : 'One last step to get started' }}
                    </h1>
                    <p class="text-blue-100 text-base leading-relaxed max-w-xs">
                        {{
                            step === 1
                                ? 'Create a free account to browse listings, save favorites, and connect with landlords.'
                                : 'Enter the 6-digit code we sent to your email to activate your account.'
                        }}
                    </p>
                </div>

                <ul class="space-y-3.5">
                    <li v-for="item in brandFeatures" :key="item" class="flex items-center gap-x-3 text-blue-50">
                        <div class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
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
            <SignUpForm v-if="step === 1" @registered="onRegistered" />
            <OtpVerify v-else :email="registeredEmail" @back="onBack" />
        </div>

    </section>
</template>

<script setup lang="ts">
import SignUpForm from '~/features/auth/components/SignUpForm.vue'
import OtpVerify from '~/features/auth/components/OtpVerify.vue'

const { t } = useI18n()

const brandFeatures = [
    'Free to browse thousands of listings',
    'Save favorites and compare properties',
    'List your property and find tenants fast',
]

useSeoMeta({
    title: `${t('auth.createAccount')} | Rentify`,
    description: t('auth.createAccountDesc'),
    ogTitle: `${t('auth.createAccount')} | Rentify`,
    ogDescription: t('auth.createAccountDesc'),
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: `${t('auth.createAccount')} | Rentify`,
    twitterDescription: t('auth.createAccountDesc'),
    robots: 'noindex, nofollow',
})

definePageMeta({ layout: 'auth' })

const step = ref<1 | 2>(1)
const registeredEmail = ref('')

const onRegistered = (email: string) => {
    registeredEmail.value = email
    step.value = 2
}

const onBack = () => {
    step.value = 1
    registeredEmail.value = ''
}
</script>
