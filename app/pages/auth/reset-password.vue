<template>
    <AuthShell :title="t('auth.brandTitle')" :description="t('auth.brandDesc')" :features="brandFeatures">
        <ForgotPasswordEmailStep v-if="step === 1" @sent="onSent" />
        <ResetPasswordOtpStep v-else-if="step === 2" :email="email" :channel="channel"
            :telegram-payload="telegramPayload" :initial-error="otpError"
            @verified="onVerified" @back="onBack" />
        <ResetPasswordNewPasswordStep v-else :email="email" :telegram-id="telegramPayload?.id" :otp="otp"
            @success="onSuccess" @invalid-otp="onInvalidOtp" />
    </AuthShell>
</template>

<script setup lang="ts">
import AuthShell from '~/components/auth/AuthShell.vue'
import ForgotPasswordEmailStep from '~/features/auth/components/ForgotPasswordEmailStep.vue'
import ResetPasswordOtpStep from '~/features/auth/components/ResetPasswordOtpStep.vue'
import ResetPasswordNewPasswordStep from '~/features/auth/components/ResetPasswordNewPasswordStep.vue'
import { RESET_PASSWORD_CHANNEL, type ResetPasswordChannel } from '~/types/channel'
import type { TelegramAuthPayload } from '~/types/telegram'
import { parseTelegramQueryField } from '~/utils/parseTelegramQueryField'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const brandFeatures = computed(() => [
    { icon: 'map-pin', text: t('auth.brandFeature1') },
    { icon: 'message-circle', text: t('auth.brandFeature2') },
    { icon: 'heart', text: t('auth.brandFeature3') },
])

const step = ref<1 | 2 | 3>(1)
const email = ref('')
const channel = ref<ResetPasswordChannel>(RESET_PASSWORD_CHANNEL.EMAIL)
const telegramPayload = ref<TelegramAuthPayload | null>(null)
const otp = ref('')
const otpError = ref('')

// reset-password-telegram-callback.vue lands the user back here (after
// forwarding the widget payload to /auth/forgot-password) with the payload
// carried as query params, since the widget's data-auth-url mode does a full
// top-level redirectphone number and can't hand off in-memory state.
onMounted(() => {
    const { channel: qChannel, id, first_name, last_name, username, photo_url, auth_date, hash } = route.query
    if (qChannel !== RESET_PASSWORD_CHANNEL.TELEGRAM || !id || !first_name || !auth_date || !hash) return

    telegramPayload.value = {
        id: Number(id),
        first_name: String(first_name),
        last_name: parseTelegramQueryField(last_name),
        username: parseTelegramQueryField(username),
        photo_url: parseTelegramQueryField(photo_url),
        auth_date: Number(auth_date),
        hash: String(hash),
    }
    channel.value = RESET_PASSWORD_CHANNEL.TELEGRAM
    otpError.value = ''
    step.value = 2
    router.replace({ path: '/auth/reset-password' })
})

const onSent = (sentEmail: string, sentChannel: ResetPasswordChannel) => {
    email.value = sentEmail
    channel.value = sentChannel
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
    channel.value = RESET_PASSWORD_CHANNEL.EMAIL
    telegramPayload.value = null
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
