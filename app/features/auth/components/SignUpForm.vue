<template>
    <div v-if="!appSettingsStore.registrationEnabled" class="w-full max-w-90 space-y-5 text-center">
        <NuxtLink to="/"
            class="animate-home-link hover:scale-105 active:scale-95 lg:hidden mb-2 mx-auto flex items-center justify-center w-fit transition-transform duration-150">
            <NuxtImg src="/sabayrent-logo.webp" alt="RokPteah"
                class="h-14 w-14 rounded-full object-cover ring-2 ring-offset-2 ring-offset-slate-50 ring-slate-200"
                width="56" height="56" />
        </NuxtLink>

        <div class="rounded-xl border border-amber-200 bg-amber-50 p-5 space-y-1.5">
            <h2 class="text-lg font-bold text-amber-800">{{ t('auth.registrationClosedTitle') }}</h2>
            <p class="text-sm text-amber-700">{{ t('auth.registrationClosedDesc') }}</p>
        </div>

        <p class="text-center text-sm text-slate-500">
            {{ t('auth.haveAccount') }}
            <NuxtLink to="/auth/login"
                class="ml-1 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                {{ t('auth.signIn') }}
            </NuxtLink>
        </p>
    </div>

    <el-form v-else ref="formRef" :model="form" :rules="rules" @submit.prevent="submit"
        class="w-full max-w-90 space-y-5">

        <!-- Logo (mobile only) -->
        <NuxtLink to="/"
            class="animate-home-link hover:scale-105 active:scale-95 lg:hidden mb-2 mx-auto flex items-center justify-center w-fit transition-transform duration-150">
            <NuxtImg src="/sabayrent-logo.webp" alt="RokPteah"
                class="h-14 w-14 rounded-full object-cover ring-2 ring-offset-2 ring-offset-slate-50 ring-slate-200"
                width="56" height="56" />
        </NuxtLink>

        <!-- Header -->
        <div class="space-y-1 text-center">
            <h2 class="text-2xl font-bold text-slate-900">{{ t('auth.createAccount') }}</h2>
            <p class="text-slate-500 text-sm">{{ t('auth.createAccountDesc') }}</p>
        </div>

        <!-- Social logins -->
        <AuthSocialLogins @google="loginWithGoogle" />

        <!-- Divider -->
        <div class="flex items-center gap-x-3">
            <span class="flex-1 h-px bg-slate-200" />
            <span class="text-xs text-slate-400 font-medium">{{ t('auth.orSignUpEmail') }}</span>
            <span class="flex-1 h-px bg-slate-200" />
        </div>

        <!-- Fields -->
        <div class="space-y-4">
            <!-- Name -->
            <div class="space-y-1.5">
                <label for="name" class="block text-sm font-medium text-slate-700">
                    {{ t('auth.name') }}
                </label>
                <el-form-item prop="name" :style="{ marginBottom: 0 }">
                    <BaseInput icon="user" id="name" size="large"
                        :placeholder="t('auth.namePlaceholder')" v-model="form.name" />
                </el-form-item>
            </div>

            <!-- Email -->
            <div class="space-y-1.5">
                <label for="mail" class="block text-sm font-medium text-slate-700">
                    {{ t('auth.email') }}
                </label>
                <el-form-item prop="email" :style="{ marginBottom: 0 }">
                    <BaseInput icon="mail" id="mail" size="large"
                        :placeholder="t('auth.emailPlaceholder')" v-model="form.email"
                        @blur="checkEmailExists" />
                </el-form-item>
            </div>

            <!-- Password -->
            <div class="space-y-1.5">
                <label for="password" class="block text-sm font-medium text-slate-700">
                    {{ t('auth.password') }}
                </label>
                <el-form-item prop="password" :style="{ marginBottom: 0 }">
                    <BaseInput id="password" icon="lock-keyhole" show-password type="password"
                        size="large" :placeholder="t('auth.passwordPlaceholder')" v-model="form.password" />
                </el-form-item>
            </div>

            <!-- Phone (optional) -->
            <div class="space-y-1.5">
                <label for="phone" class="block text-sm font-medium text-slate-700">
                    {{ t('auth.phone') }}
                </label>
                <el-form-item prop="phone" :style="{ marginBottom: 0 }">
                    <BaseInput icon="phone" id="phone" size="large"
                        :placeholder="t('auth.phonePlaceholder')" v-model="form.phone"
                        @blur="checkPhoneExists" />
                </el-form-item>
            </div>

            <!-- Role -->
            <div class="space-y-1.5">
                <span class="block text-sm font-medium text-slate-700">{{ t('auth.iAmA') }}</span>
                <div class="grid grid-cols-2 gap-3">
                    <button type="button" @click="role = 'USER'"
                        :class="role === 'USER'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
                        class="flex flex-col items-center gap-y-1.5 rounded-xl border-2 p-3
                               text-sm font-medium transition-all duration-150 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                        {{ t('auth.roleTenant') }}
                    </button>
                    <button type="button" @click="role = 'LANDLORD'"
                        :class="role === 'LANDLORD'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
                        class="flex flex-col items-center gap-y-1.5 rounded-xl border-2 p-3
                               text-sm font-medium transition-all duration-150 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        {{ t('auth.roleLandlord') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Submit -->
        <BaseButton native-type="submit" block size="large" :loading="isSubmitting"
            :label="isSubmitting ? t('auth.creating') : t('auth.signUp')" />

        <!-- Sign in -->
        <p class="text-center text-sm text-slate-500">
            {{ t('auth.haveAccount') }}
            <NuxtLink to="/auth/login"
                class="ml-1 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                {{ t('auth.signIn') }}
            </NuxtLink>
        </p>
    </el-form>
</template>

<script setup lang="ts">
import AuthSocialLogins from '~/components/auth/AuthSocialLogins.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import { useAuthFormRules } from '~/features/auth/composable/useAuthFormRules'
import { useAppSettingsStore } from '~/stores/appSettings'

export interface RegisterPayload {
    name: string
    email: string
    password: string
    role: 'USER' | 'LANDLORD'
    phone?: string
}

const emit = defineEmits<{ registered: [email: string, payload: RegisterPayload] }>()

const { t } = useI18n()
const api = useApi()
const notify = useNotify()
const { extract } = useErrorMsg()
const appSettingsStore = useAppSettingsStore()

const { registerRules } = useAuthFormRules()
const { formRef, form, rules, isSubmitting, handleSubmit, setFieldError } = useForm(
    { name: '', email: '', password: '', phone: '' },
    registerRules,
)

const role = ref<'USER' | 'LANDLORD'>('USER')

// Avoid re-checking the same address on repeated blurs (e.g. tabbing through the form)
let lastCheckedEmail = ''

const checkEmailExists = async () => {
    const email = form.email.trim()
    if (!email || !isValidEmail(email) || email === lastCheckedEmail) return

    try {
        const { data: exists } = await api.get<boolean>('/user/is-email-exist', { params: { email } })
        lastCheckedEmail = email
        if (exists) setFieldError('email', t('auth.emailTaken'))
    } catch {
        // Non-blocking: submit-time /auth/register call will surface a duplicate email anyway
    }
}

// Phone is optional — only check once it's a non-empty, validly formatted number
let lastCheckedPhone = ''

const checkPhoneExists = async () => {
    const phone = form.phone.trim()
    if (!phone || !isValidPhone(phone)) return

    const phoneNumber = normalizePhoneNumber(phone)
    if (phoneNumber === lastCheckedPhone) return

    try {
        const { data: exists } = await api.get<boolean>('/user/is-phone-exist', { params: { phoneNumber } })
        lastCheckedPhone = phoneNumber
        if (exists) setFieldError('phone', t('auth.phoneTaken'))
    } catch {
        // Non-blocking: submit-time /auth/register call will surface a duplicate phone anyway
    }
}

const loginWithGoogle = () => {
    // Routed through the /api proxy (see routeRules in nuxt.config.ts) so the
    // OAuth callback's Set-Cookie lands on this same origin, not onrender.com.
    window.location.href = '/api/auth/google'
}

const submit = handleSubmit(async () => {
    try {
        const payload: RegisterPayload = {
            name: form.name.trim(),
            email: form.email,
            password: form.password,
            role: role.value,
            ...(form.phone.trim() ? { phone: normalizePhoneNumber(form.phone) } : {}),
        }
        await api.post('/auth/register', payload)
        emit('registered', form.email, payload)
    } catch (err) {
        const status = (err as { response?: { status?: number } })?.response?.status
        if (status === 409) {
            notify.info(extract(err))
            await navigateTo('/auth/login')
        } else if (status === 400) {
            setFieldError('email', extract(err))
        } else {
            notify.error(extract(err))
        }
    }
})
</script>
