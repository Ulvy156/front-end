<template>
    <form @submit.prevent="submit" class="w-full max-w-90 space-y-6">

        <!-- Icon + header -->
        <div class="space-y-3 text-center">
            <div class="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto">
                <BaseIcon name="mail" :size="28" class="text-emerald-600" />
            </div>
            <div class="space-y-1">
                <h2 class="text-2xl font-bold text-slate-900">{{ t('auth.verifyEmail') }}</h2>
                <p class="text-slate-500 text-sm">
                    {{ t('auth.codeSentTo') }}
                    <span class="font-medium text-slate-700">{{ email }}</span>
                </p>
            </div>
        </div>

        <!-- 6-box OTP input -->
        <OtpInputBoxes ref="otpBoxes" v-model="otp" :error="error" />

        <!-- Verify button -->
        <BaseButton native-type="submit" block size="large" :loading="isLoading" :disabled="otp.length < 6"
            :label="isLoading ? t('auth.verifying') : t('auth.verifyAccount')" />

        <!-- Resend code (only shown when resendData is provided or auto-send is enabled) -->
        <div v-if="resendData || autoSendOtp" class="text-center text-sm text-slate-500">
            <button
                v-if="resendCooldown === 0"
                type="button"
                :disabled="isResending"
                @click="resend"
                class="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer
                       disabled:opacity-60 disabled:cursor-not-allowed">
                <span v-if="isResending">{{ t('auth.sending') }}</span>
                <span v-else>{{ t('auth.resendCode') }}</span>
            </button>
            <span v-else class="text-slate-400">
                {{ t('auth.resendIn', { n: resendCooldown }) }}
            </span>
        </div>

        <!-- Back -->
        <p class="text-center text-sm text-slate-500">
            {{ t('auth.wrongEmail') }}
            <button type="button" @click="emit('back')"
                class="ml-1 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer">
                {{ t('auth.goBack') }}
            </button>
        </p>
    </form>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import { resolvePostLoginRoute } from '~/utils/roleGuard'
import OtpInputBoxes from './OtpInputBoxes.vue'
import type { RegisterPayload } from './SignUpForm.vue'

const props = defineProps<{
    email: string
    resendData?: RegisterPayload | null
    autoSendOtp?: boolean
}>()
const emit = defineEmits<{ back: [] }>()

const { t } = useI18n()
const api = useApi()
const notify = useNotify()
const authStore = useAuthStore()
const { extract } = useErrorMsg()

const otp = ref('')
const otpBoxes = ref<InstanceType<typeof OtpInputBoxes>>()

const isLoading = ref(false)
const isResending = ref(false)
const error = ref('')

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

onUnmounted(() => {
    if (cooldownTimer) clearInterval(cooldownTimer)
})

const sendOtp = () => {
    if (props.resendData) {
        return api.post('/auth/register', props.resendData)
    }
    return api.post('/auth/resend-otp', { email: props.email })
}

onMounted(() => {
    if (!props.autoSendOtp) return
    startCooldown()
    sendOtp()
        .then(() => notify.success(t('auth.codeSentSuccess')))
        .catch((err) => notify.error(extract(err)))
})

watch(otp, () => { error.value = '' })

const resend = async () => {
    isResending.value = true
    try {
        await sendOtp()
        notify.success(t('auth.codeSentSuccess'))
        startCooldown()
        otpBoxes.value?.reset()
    } catch (err) {
        const status = (err as { response?: { status?: number } })?.response?.status
        if (status !== 429) notify.error(extract(err))
    } finally {
        isResending.value = false
    }
}

const submit = async () => {
    if (otp.value.length < 6) {
        error.value = t('auth.enterCode')
        return
    }
    isLoading.value = true
    try {
        await api.post('/auth/verify-account', {
            email: props.email,
            otp: otp.value,
        })
        await authStore.fetchProfile()
        await navigateTo(resolvePostLoginRoute(authStore.user?.role))
    } catch (err) {
        const status = (err as { response?: { status?: number } })?.response?.status
        if (status === 400) {
            error.value = extract(err)
            otpBoxes.value?.reset()
        } else if (status !== 429) {
            notify.error(extract(err))
        }
    } finally {
        isLoading.value = false
    }
}
</script>
