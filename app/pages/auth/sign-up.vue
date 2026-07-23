<template>
    <section class="min-h-dvh flex items-stretch">

        <AuthBrandPanel
            :title="step === 1 ? t('auth.signupBrandTitle1') : t('auth.signupBrandTitle2')"
            :description="step === 1 ? t('auth.signupBrandDesc1') : t('auth.signupBrandDesc2')"
            :features="brandFeatures" />

        <!-- Form Panel -->
        <div class="flex-1 flex items-center justify-center bg-slate-50 px-6 py-14">
            <SignUpForm v-if="step === 1" @registered="onRegistered" />
            <OtpVerify v-else :email="registeredEmail" :resend-data="resendPayload" @back="onBack" />
        </div>

    </section>
</template>

<script setup lang="ts">
import AuthBrandPanel from '~/components/auth/AuthBrandPanel.vue'
import SignUpForm, { type RegisterPayload } from '~/features/auth/components/SignUpForm.vue'
import OtpVerify from '~/features/auth/components/OtpVerify.vue'

const { t } = useI18n()

const brandFeatures = computed(() => [
    { icon: 'search', text: t('auth.signupBrandFeature1') },
    { icon: 'heart', text: t('auth.signupBrandFeature2') },
    { icon: 'house-plus', text: t('auth.signupBrandFeature3') },
])

useSeoMeta({
    title: `${t('auth.createAccount')} | RokPteah`,
    description: t('auth.createAccountDesc'),
    ogTitle: `${t('auth.createAccount')} | RokPteah`,
    ogDescription: t('auth.createAccountDesc'),
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: `${t('auth.createAccount')} | RokPteah`,
    twitterDescription: t('auth.createAccountDesc'),
    robots: 'noindex, nofollow',
})

definePageMeta({ layout: 'auth', middleware: 'guest' })

const step = ref<1 | 2>(1)
const registeredEmail = ref('')
const resendPayload = ref<RegisterPayload | null>(null)

const onRegistered = (email: string, payload: RegisterPayload) => {
    registeredEmail.value = email
    resendPayload.value = payload
    step.value = 2
}

const onBack = () => {
    step.value = 1
    registeredEmail.value = ''
    resendPayload.value = null
}
</script>
