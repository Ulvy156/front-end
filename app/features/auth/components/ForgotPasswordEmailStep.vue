<template>
    <div class="w-full max-w-90 space-y-6 text-center">
        <div class="space-y-1">
            <h2 class="text-2xl font-bold text-slate-900">{{ t('auth.forgotPass') }}</h2>
            <p class="text-slate-500 text-sm">{{ t('auth.forgotPassDesc') }}</p>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="submit" class="space-y-5 text-left">
            <div class="space-y-1.5">
                <label for="mail" class="block text-sm font-medium text-slate-700">{{ t('auth.email') }}</label>
                <el-form-item prop="email" :style="{ marginBottom: 0 }">
                    <BaseInput id="mail" icon="mail" size="large" :placeholder="t('auth.emailPlaceholder')"
                        v-model="form.email" />
                </el-form-item>
            </div>

            <BaseButton native-type="submit" block size="large" :loading="isSubmitting"
                :label="isSubmitting ? t('auth.sending') : t('auth.sendCode')" />
        </el-form>

        <NuxtLink to="/auth/login"
            class="text-sm font-semibold flex items-center justify-center gap-x-2 text-slate-600 hover:text-slate-800 transition-colors">
            <BaseIcon name="move-left" />
            {{ t('auth.backLogin') }}
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import { useErrorMsg } from '~/composables/useErrorMsg'
import { useForm } from '~/composables/useForm'
import { useAuthFormRules } from '../composable/useAuthFormRules'

const emit = defineEmits<{ sent: [email: string] }>()

const { t } = useI18n()
const api = useApi()
const notify = useNotify()
const { extract } = useErrorMsg()

const { forgotPasswordRules } = useAuthFormRules()
const { formRef, form, rules, isSubmitting, handleSubmit } = useForm(
    { email: '' },
    forgotPasswordRules,
)

const submit = handleSubmit(async () => {
    try {
        const email = form.email.trim()
        await api.post('/auth/forgot-password', { email, channel: 'email' })
        emit('sent', email)
    } catch (err) {
        const status = (err as { response?: { status?: number } })?.response?.status
        if (status !== 429) notify.error(extract(err))
    }
})
</script>
