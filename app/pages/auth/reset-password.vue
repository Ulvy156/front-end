<template>
    <AuthShell :title="t('auth.brandTitle')" :description="t('auth.brandDesc')" :features="brandFeatures">
        <ForgotPasswordEmailStep v-if="step === 1" @sent="onSent" />
        <ResetPasswordOtpStep v-else-if="step === 2" :email="email" :initial-error="otpError"
            @verified="onVerified" @back="onBack" />
        <ResetPasswordNewPasswordStep v-else :email="email" :otp="otp"
            @success="onSuccess" @invalid-otp="onInvalidOtp" />
    </AuthShell>
</template>

<script setup lang="ts">
import AuthShell from '~/components/auth/AuthShell.vue'
import ForgotPasswordEmailStep from '~/features/auth/components/ForgotPasswordEmailStep.vue'
import ResetPasswordOtpStep from '~/features/auth/components/ResetPasswordOtpStep.vue'
import ResetPasswordNewPasswordStep from '~/features/auth/components/ResetPasswordNewPasswordStep.vue'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()

const brandFeatures = computed(() => [
    { icon: 'map-pin', text: t('auth.brandFeature1') },
    { icon: 'message-circle', text: t('auth.brandFeature2') },
    { icon: 'heart', text: t('auth.brandFeature3') },
])

const step = ref<1 | 2 | 3>(1)
const email = ref('')
const otp = ref('')
const otpError = ref('')

const onSent = (sentEmail: string) => {
    email.value = sentEmail
    otpError.value = ''
    step.value = 2
}

const onVerified = (verifiedOtp: string) => {
    otp.value = verifiedOtp
    step.value = 3
}

const onBack = () => {
    step.value = 1
    email.value = ''
    otp.value = ''
    otpError.value = ''
}

const onSuccess = async () => {
    await navigateTo('/auth/login')
}

const onInvalidOtp = (message: string) => {
    otpError.value = message
    otp.value = ''
    step.value = 2
}
</script>
