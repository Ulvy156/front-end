<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import type { UseMutationReturnType } from '@tanstack/vue-query'

const props = defineProps<{
  mutation: UseMutationReturnType<unknown, unknown, { currentPassword: string; newPassword: string }, unknown>
}>()

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()

const isOpen = ref(false)

const passwordRules: FormRules = {
  currentPassword: [
    { required: true, message: () => t('profile.password.currentRequired'), trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: () => t('profile.password.newRequired'), trigger: 'blur' },
    {
      validator: (_rule, value: string, callback) => {
        if (!isStrongPassword(value)) callback(new Error(t('auth.passwordWeak')))
        else callback()
      },
      trigger: 'blur',
    },
  ],
}

const {
  formRef,
  form,
  rules,
  isSubmitting,
  handleSubmit,
  setFieldError,
  reset,
} = useForm({ currentPassword: '', newPassword: '' }, passwordRules)

function toggle() {
  isOpen.value = !isOpen.value
  if (!isOpen.value) reset()
}

const submitPassword = handleSubmit(async () => {
  try {
    await props.mutation.mutateAsync({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    })
    success(t('profile.password.success'))
    isOpen.value = false
    reset()
  } catch (err) {
    setFieldError('currentPassword', extract(err))
  }
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-semibold text-gray-900">{{ $t('profile.password.title') }}</h3>
        <p class="text-xs text-gray-400 mt-0.5">{{ $t('profile.password.subtitle') }}</p>
      </div>
      <el-button size="small" @click="toggle">
        {{ isOpen ? $t('profile.cancel') : $t('profile.password.change') }}
      </el-button>
    </div>

    <el-form
      v-if="isOpen"
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="mt-4 max-w-sm space-y-1"
      @submit.prevent="submitPassword"
    >
      <el-form-item :label="$t('profile.password.current')" prop="currentPassword">
        <el-input v-model="form.currentPassword" type="password" show-password />
      </el-form-item>

      <el-form-item :label="$t('profile.password.new')" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" show-password />
      </el-form-item>

      <p class="text-xs text-gray-400 pb-2">{{ $t('profile.password.requirements') }}</p>

      <el-button type="primary" :loading="isSubmitting" native-type="submit">
        {{ $t('profile.password.submit') }}
      </el-button>
    </el-form>
  </div>
</template>
