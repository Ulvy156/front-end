<template>
    <section class="min-h-dvh flex items-center justify-center px-4
           bg-linear-to-br from-slate-200 via-slate-100 to-slate-200">
        <div class="w-full max-w-md
             bg-white/70 backdrop-blur-xl
             border border-white/60
             shadow-[0_25px_50px_-15px_rgba(0,0,0,0.25)]
             rounded-2xl p-6
             flex flex-col items-center gap-y-6">

            <!-- Step 1: Email -->
            <template v-if="step === 1">
                <div class="text-center space-y-1 w-full">
                    <h3 class="text-xl font-semibold text-slate-900">{{ t('auth.forgotPass') }}</h3>
                    <p class="text-slate-500 text-sm">{{ t('auth.forgotPassDesc') }}</p>
                </div>

                <div class="w-full space-y-1.5">
                    <label for="mail" class="text-sm font-medium text-slate-700">{{ t('auth.email') }}</label>
                    <BaseInput id="mail" size="large" :placeholder="t('auth.emailPlaceholder')" v-model="email">
                        <template #prefix><BaseIcon name="mail" /></template>
                    </BaseInput>
                    <p v-if="emailError" class="text-xs text-red-500">{{ emailError }}</p>
                </div>

                <button type="button" @click="requestOtp" :disabled="isLoading || !email.trim()"
                    class="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white
                           hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed">
                    <span v-if="isLoading" class="flex items-center justify-center gap-x-2">
                        <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {{ t('auth.sending') }}
                    </span>
                    <span v-else>{{ t('auth.sendCode') }}</span>
                </button>

                <NuxtLink to="/auth/login"
                    class="text-sm font-semibold flex items-center gap-x-2 text-slate-600 hover:text-slate-800 transition">
                    <BaseIcon name="move-left" />
                    {{ t('auth.backLogin') }}
                </NuxtLink>
            </template>

            <!-- Step 2: OTP -->
            <template v-else-if="step === 2">
                <div class="space-y-3 text-center w-full">
                    <div class="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-emerald-600" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                    </div>
                    <div class="space-y-1">
                        <h3 class="text-xl font-semibold text-slate-900">{{ t('auth.verifyEmail') }}</h3>
                        <p class="text-slate-500 text-sm">
                            {{ t('auth.codeSentTo') }}
                            <span class="font-medium text-slate-700">{{ email }}</span>
                        </p>
                    </div>
                </div>

                <!-- 6-box OTP input -->
                <div class="w-full space-y-2">
                    <div class="flex items-center justify-center gap-x-2">
                        <input
                            v-for="(_, i) in 6" :key="i"
                            :ref="(el) => { if (el) otpInputs[i] = el as HTMLInputElement }"
                            type="text" inputmode="numeric" maxlength="1"
                            :value="otpDigits[i]"
                            @input="handleInput(i, $event as InputEvent)"
                            @keydown="handleKeydown(i, $event as KeyboardEvent)"
                            @paste.prevent="handlePaste($event as ClipboardEvent)"
                            :class="otpError ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'"
                            class="w-11 h-14 rounded-xl border-2 text-center text-xl font-bold
                                   text-slate-900 bg-white outline-none transition-colors duration-150" />
                    </div>
                    <p v-if="otpError" class="text-xs text-red-500 text-center">{{ otpError }}</p>
                </div>

                <button type="button" @click="verifyOtp" :disabled="otp.length < 6"
                    class="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white
                           hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed">
                    {{ t('auth.continue') }}
                </button>

                <!-- Resend -->
                <div class="text-sm text-slate-500">
                    <button v-if="resendCooldown === 0" type="button" :disabled="isResending" @click="resendOtp"
                        class="font-semibold text-emerald-600 hover:text-emerald-700 transition cursor-pointer disabled:opacity-60">
                        <span v-if="isResending">{{ t('auth.sending') }}</span>
                        <span v-else>{{ t('auth.resendCode') }}</span>
                    </button>
                    <span v-else class="text-slate-400">{{ t('auth.resendIn', { n: resendCooldown }) }}</span>
                </div>

                <button type="button" @click="step = 1"
                    class="text-sm font-semibold flex items-center gap-x-2 text-slate-600 hover:text-slate-800 transition">
                    <BaseIcon name="move-left" />
                    {{ t('auth.backLogin') }}
                </button>
            </template>

            <!-- Step 3: New password -->
            <template v-else>
                <div class="text-center space-y-1 w-full">
                    <h3 class="text-xl font-semibold text-slate-900">{{ t('auth.resetPassword') }}</h3>
                    <p class="text-slate-500 text-sm">{{ t('auth.chooseNewPassword') }}</p>
                </div>

                <div class="w-full space-y-4">
                    <div class="space-y-1.5">
                        <label class="text-sm font-medium text-slate-700">{{ t('auth.newPassword') }}</label>
                        <BaseInput
                            size="large"
                            icon="lock-keyhole"
                            type="password"
                            show-password
                            :placeholder="t('auth.newPasswordPlaceholder')"
                            v-model="newPassword" />
                        <p v-if="passwordError" class="text-xs text-red-500">{{ passwordError }}</p>
                    </div>
                </div>

                <button type="button" @click="resetPassword" :disabled="isLoading || !newPassword.trim()"
                    class="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white
                           hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed">
                    <span v-if="isLoading" class="flex items-center justify-center gap-x-2">
                        <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {{ t('auth.saving') }}
                    </span>
                    <span v-else>{{ t('auth.savePassword') }}</span>
                </button>
            </template>
        </div>
    </section>
</template>

<script setup lang="ts">
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import { useErrorMsg } from '~/composables/useErrorMsg'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const api = useApi()
const notify = useNotify()
const { extract } = useErrorMsg()

const step = ref<1 | 2 | 3>(1)
const email = ref('')
const emailError = ref('')
const newPassword = ref('')
const passwordError = ref('')
const isLoading = ref(false)
const isResending = ref(false)

const otpDigits = reactive(['', '', '', '', '', ''])
const otpInputs: HTMLInputElement[] = []
const otp = computed(() => otpDigits.join(''))
const otpError = ref('')

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

onUnmounted(() => { if (cooldownTimer) clearInterval(cooldownTimer) })

watch(email, () => { emailError.value = '' })

const handleInput = (index: number, event: InputEvent) => {
    const val = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(-1)
    otpDigits[index] = val
    otpError.value = ''
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

const resetOtpBox = () => {
    otpDigits.fill('')
    nextTick(() => otpInputs[0]?.focus())
}

const requestOtp = async () => {
    if (!email.value.trim()) return
    if (!isValidEmail(email.value.trim())) {
        emailError.value = t('auth.emailInvalid')
        return
    }
    emailError.value = ''
    isLoading.value = true
    try {
        await api.post('/auth/forgot-password', { email: email.value.trim(), channel: 'email' })
        startCooldown()
        step.value = 2
    } catch (err) {
        notify.error(extract(err))
    } finally {
        isLoading.value = false
    }
}

const verifyOtp = () => {
    if (otp.value.length < 6) {
        otpError.value = t('auth.enterCode')
        return
    }
    step.value = 3
}

const resendOtp = async () => {
    isResending.value = true
    try {
        await api.post('/auth/forgot-password', { email: email.value.trim(), channel: 'email' })
        notify.success(t('auth.codeSentSuccess'))
        startCooldown()
        resetOtpBox()
    } catch (err) {
        notify.error(extract(err))
    } finally {
        isResending.value = false
    }
}

const resetPassword = async () => {
    if (!isStrongPassword(newPassword.value)) {
        passwordError.value = t('auth.passwordWeak')
        return
    }
    passwordError.value = ''
    isLoading.value = true
    try {
        await api.post('/auth/reset-password', {
            email: email.value.trim(),
            otp: otp.value,
            newPassword: newPassword.value,
        })
        notify.success(t('auth.passwordResetSuccess'))
        await navigateTo('/auth/login')
    } catch (err) {
        const status = (err as { response?: { status?: number } })?.response?.status
        if (status === 400) {
            otpError.value = extract(err)
            resetOtpBox()
            step.value = 2
        } else {
            notify.error(extract(err))
        }
    } finally {
        isLoading.value = false
    }
}
</script>
