<template>
    <div class="w-full max-w-90 space-y-6">
        <div class="space-y-3 text-center">
            <div class="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto">
                <BaseIcon name="mail" :size="28" class="text-emerald-600" />
            </div>
            <div class="space-y-1">
                <h2 class="text-2xl font-bold text-slate-900">{{ t('auth.verifyEmail') }}</h2>
                <p class="text-slate-500 text-sm">
                    {{ codeSentText }}
                    <span class="font-medium text-slate-700">{{ identifierLabel }}</span>
                </p>
            </div>
        </div>

        <OtpInputBoxes ref="otpBoxes" v-model="otp" :error="otpError" />

        <BaseButton block size="large" :disabled="otp.length < 6" :label="t('auth.continue')" @click="verify" />

        <div class="text-center text-sm text-slate-500">
            <button v-if="resendCooldown === 0" type="button" :disabled="isResending" @click="resend"
                class="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer
                       disabled:opacity-60 disabled:cursor-not-allowed">
                <span v-if="isResending">{{ t('auth.sending') }}</span>
                <span v-else>{{ t('auth.resendCode') }}</span>
            </button>
            <span v-else class="text-slate-400">{{ t('auth.resendIn', { n: resendCooldown }) }}</span>
        </div>

        <button type="button" @click="emit('back')"
            class="text-sm font-semibold flex items-center justify-center gap-x-2 text-slate-600 hover:text-slate-800 transition-colors mx-auto">
            <BaseIcon name="move-left" />
            {{ t('auth.backLogin') }}
        </button>
    </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import { useErrorMsg } from '~/composables/useErrorMsg'
import { RESET_PASSWORD_CHANNEL, type ResetPasswordChannel } from '~/types/channel'
import type { TelegramAuthPayload } from '~/types/telegram'
import OtpInputBoxes from './OtpInputBoxes.vue'

const props = defineProps<{
    email?: string
    channel: ResetPasswordChannel
    telegramPayload?: TelegramAuthPayload | null
    initialError?: string
}>()
const emit = defineEmits<{ verified: [otp: string], back: [] }>()

const { t } = useI18n()
const api = useApi()
const notify = useNotify()
const { extract } = useErrorMsg()

const isTelegram = computed(() => props.channel === RESET_PASSWORD_CHANNEL.TELEGRAM)

const codeSentText = computed(() => isTelegram.value ? t('auth.codeSentToTelegram') : t('auth.codeSentTo'))

const identifierLabel = computed(() => {
    if (!isTelegram.value) return props.email
    const payload = props.telegramPayload
    return payload?.username ? `@${payload.username}` : payload?.first_name ?? ''
})

const otp = ref('')
const otpError = ref(props.initialError ?? '')
const otpBoxes = ref<InstanceType<typeof OtpInputBoxes>>()
const isResending = ref(false)

const resendCooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

const startCooldown = () => {
    resendCooldown.value = 60
    cooldownTimer = setInterval(() => {
        resendCooldown.value--
        if (resendCooldown.value <= 0 && cooldownTimer) {
            clearInterval(cooldownTimer)
            cooldownTimer = null
        }
    }, 1000)
}

onMounted(() => startCooldown())
onUnmounted(() => { if (cooldownTimer) clearInterval(cooldownTimer) })

watch(otp, () => { otpError.value = '' })

const verify = () => {
    if (otp.value.length < 6) {
        otpError.value = t('auth.enterCode')
        return
    }
    emit('verified', otp.value)
}

const resend = async () => {
    isResending.value = true
    try {
        if (isTelegram.value) {
            await api.post('/auth/forgot-password', { channel: props.channel, telegram: props.telegramPayload })
        } else {
            await api.post('/auth/forgot-password', { email: props.email, channel: props.channel })
        }
        notify.success(isTelegram.value ? t('auth.codeSentSuccessTelegram') : t('auth.codeSentSuccess'))
        startCooldown()
        otpBoxes.value?.reset()
    } catch (err) {
        const status = (err as { response?: { status?: number } })?.response?.status
        if (status !== 429) notify.error(extract(err))
    } finally {
        isResending.value = false
    }
}
</script>
