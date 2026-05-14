<template>
    <form @submit.prevent="submit" class="w-full max-w-[360px] space-y-6">

        <!-- Icon + header -->
        <div class="space-y-3 text-center">
            <div class="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-blue-600" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
            </div>
            <div class="space-y-1">
                <h2 class="text-2xl font-bold text-slate-900">Verify your email</h2>
                <p class="text-slate-500 text-sm">
                    We sent a 6-digit code to
                    <span class="font-medium text-slate-700">{{ email }}</span>
                </p>
            </div>
        </div>

        <!-- 6-box OTP input -->
        <div class="space-y-2">
            <div class="flex items-center justify-center gap-x-2">
                <input
                    v-for="(_, i) in 6" :key="i"
                    :ref="(el) => { if (el) otpInputs[i] = el as HTMLInputElement }"
                    type="text" inputmode="numeric" maxlength="1"
                    :value="otpDigits[i]"
                    @input="handleInput(i, $event as InputEvent)"
                    @keydown="handleKeydown(i, $event as KeyboardEvent)"
                    @paste.prevent="handlePaste($event as ClipboardEvent)"
                    :class="error ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'"
                    class="w-11 h-14 rounded-xl border-2 text-center text-xl font-bold
                           text-slate-900 bg-white outline-none transition-colors duration-150" />
            </div>
            <p v-if="error" class="text-xs text-red-500 text-center">{{ error }}</p>
        </div>

        <!-- Verify button -->
        <button type="submit" :disabled="isLoading || otp.length < 6"
            class="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white
                   hover:bg-blue-700 active:scale-[0.99] shadow-sm shadow-blue-200/60
                   transition-all duration-150 cursor-pointer
                   disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100">
            <span v-if="isLoading" class="flex items-center justify-center gap-x-2">
                <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying...
            </span>
            <span v-else>Verify account</span>
        </button>

        <!-- Back -->
        <p class="text-center text-sm text-slate-500">
            Wrong email?
            <button type="button" @click="emit('back')"
                class="ml-1 font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                Go back
            </button>
        </p>
    </form>
</template>

<script setup lang="ts">
import type { AxiosError } from 'axios'

const props = defineProps<{ email: string }>()
const emit = defineEmits<{ back: [] }>()

const api = useApi()
const notify = useNotify()
const authStore = useAuthStore()
const accessToken = useCookie<string | null>('access_token', { sameSite: 'lax' })

const otpDigits = reactive(['', '', '', '', '', ''])
const otpInputs: HTMLInputElement[] = []
const otp = computed(() => otpDigits.join(''))

const isLoading = ref(false)
const error = ref('')

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

const submit = async () => {
    if (otp.value.length < 6) {
        error.value = 'Please enter the 6-digit code'
        return
    }
    isLoading.value = true
    try {
        const { data } = await api.post<{ accessToken: string; user_id: string }>('/auth/verify-account', {
            email: props.email,
            otp: otp.value,
        })
        accessToken.value = data.accessToken
        await authStore.fetchProfile()
        await navigateTo('/')
    } catch (err) {
        const status = (err as AxiosError)?.response?.status
        if (status === 400) {
            error.value = 'Invalid or expired code. Please try again.'
            resetOtp()
        } else if (status === 429) {
            notify.error('Too many attempts. Try again in 15 minutes.', 'Rate Limited')
        } else {
            notify.error('Something went wrong. Please try again.')
        }
    } finally {
        isLoading.value = false
    }
}
</script>
