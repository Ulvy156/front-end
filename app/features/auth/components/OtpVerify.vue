<template>
    <form @submit.prevent="submit" class="w-full max-w-[360px] space-y-6">

        <!-- Icon + header -->
        <div class="space-y-3 text-center">
            <div class="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-emerald-600" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
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
        <div class="space-y-2">
            <div class="flex items-center justify-center gap-x-1.5 sm:gap-x-2">
                <input
                    v-for="(_, i) in 6" :key="i"
                    :ref="(el) => { if (el) otpInputs[i] = el as HTMLInputElement }"
                    type="text" inputmode="numeric" maxlength="1"
                    :value="otpDigits[i]"
                    @input="handleInput(i, $event as InputEvent)"
                    @keydown="handleKeydown(i, $event as KeyboardEvent)"
                    @paste.prevent="handlePaste($event as ClipboardEvent)"
                    :class="error ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'"
                    class="w-9 h-12 sm:w-11 sm:h-14 rounded-xl border-2 text-center text-lg sm:text-xl font-bold
                           text-slate-900 bg-white outline-none transition-colors duration-150" />
            </div>
            <p v-if="error" class="text-xs text-red-500 text-center">{{ error }}</p>
        </div>

        <!-- Verify button -->
        <button type="submit" :disabled="isLoading || otp.length < 6"
            class="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white
                   hover:bg-emerald-700 active:scale-[0.99] shadow-sm shadow-emerald-200/60
                   transition-all duration-150 cursor-pointer
                   disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100">
            <span v-if="isLoading" class="flex items-center justify-center gap-x-2">
                <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {{ t('auth.verifying') }}
            </span>
            <span v-else>{{ t('auth.verifyAccount') }}</span>
        </button>

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
import { resolvePostLoginRoute } from '~/utils/roleGuard'
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

const otpDigits = reactive(['', '', '', '', '', ''])
const otpInputs: HTMLInputElement[] = []
const otp = computed(() => otpDigits.join(''))

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

const handleInput = (index: number, event: InputEvent) => {
    const val = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(-1)
    otpDigits[index] = val
    error.value = ''
    if (val && index < 5) otpInputs[index + 1]?.focus()
}

const handleKeydown = (index: number, event: KeyboardEvent) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
        otpDigits[index - 1] = ''
        otpInputs[index - 1]?.focus()
    }
}

const handlePaste = (event: ClipboardEvent) => {
    const pasted = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, 6)
    pasted.split('').forEach((char, i) => { otpDigits[i] = char })
    nextTick(() => otpInputs[Math.min(pasted.length, 5)]?.focus())
}

const resetOtp = () => {
    otpDigits.fill('')
    nextTick(() => otpInputs[0]?.focus())
}

const resend = async () => {
    isResending.value = true
    try {
        await sendOtp()
        notify.success(t('auth.codeSentSuccess'))
        startCooldown()
        resetOtp()
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
            resetOtp()
        } else if (status !== 429) {
            notify.error(extract(err))
        }
    } finally {
        isLoading.value = false
    }
}
</script>
