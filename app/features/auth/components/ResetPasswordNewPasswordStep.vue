<template>
    <div class="w-full max-w-90 space-y-6 text-center">
        <div class="space-y-1">
            <h2 class="text-2xl font-bold text-slate-900">{{ t('auth.resetPassword') }}</h2>
            <p class="text-slate-500 text-sm">{{ t('auth.chooseNewPassword') }}</p>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="submit" class="space-y-5 text-left">
            <div class="space-y-1.5">
                <label class="block text-sm font-medium text-slate-700">{{ t('auth.newPassword') }}</label>
                <el-form-item prop="newPassword" :style="{ marginBottom: 0 }">
                    <BaseInput size="large" icon="lock-keyhole" type="password" show-password
                        :placeholder="t('auth.newPasswordPlaceholder')" v-model="form.newPassword" />
                </el-form-item>
            </div>

            <BaseButton native-type="submit" block size="large" :loading="isSubmitting"
                :label="isSubmitting ? t('auth.saving') : t('auth.savePassword')" />
        </el-form>
    </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import { useErrorMsg } from '~/composables/useErrorMsg'
import { useForm } from '~/composables/useForm'
import { useAuthFormRules } from '../composable/useAuthFormRules'

const props = defineProps<{
    email?: string
    telegramId?: number
    otp: string
}>()
const emit = defineEmits<{ success: [], invalidOtp: [message: string] }>()

const { t } = useI18n()
const api = useApi()
const notify = useNotify()
const { extract } = useErrorMsg()

const { resetPasswordRules } = useAuthFormRules()
const { formRef, form, rules, isSubmitting, handleSubmit } = useForm(
    { newPassword: '' },
    resetPasswordRules,
)

const submit = handleSubmit(async () => {
    try {
        const identifier = props.telegramId
            ? { telegramId: props.telegramId }
            : { email: props.email }
        await api.post('/auth/reset-password', {
            ...identifier,
            otp: props.otp,
            newPassword: form.newPassword,
        })
        notify.success(t('auth.passwordResetSuccess'))
        emit('success')
    } catch (err) {
        const status = (err as { response?: { status?: number } })?.response?.status
        if (status === 400) {
            emit('invalidOtp', extract(err))
        } else if (status !== 429) {
            notify.error(extract(err))
        }
    }
})
</script>
