<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import type { UseMutationReturnType } from '@tanstack/vue-query'
import dayjs from 'dayjs'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import { Role } from '~/types/role'
import type { DeletionRequestResult, UserProfile } from '../types/profile'

const props = defineProps<{
  profile: UserProfile
  requestMutation: UseMutationReturnType<DeletionRequestResult, unknown, string, unknown>
  cancelMutation: UseMutationReturnType<unknown, unknown, void, unknown>
}>()

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()

const isDialogOpen = ref(false)
const isLandlord = computed(() => props.profile.role === Role.LANDLORD)
const scheduledForLabel = computed(() =>
  props.profile.deletionScheduledFor ? dayjs(props.profile.deletionScheduledFor).format('MMMM D, YYYY') : '',
)

const rules: FormRules = {
  currentPassword: [
    { required: true, message: () => t('profile.deleteAccount.passwordRequired'), trigger: 'blur' },
  ],
}

const {
  formRef,
  form,
  isSubmitting,
  handleSubmit,
  setFieldError,
  reset,
} = useForm({ currentPassword: '' }, rules)

function openDialog() {
  isDialogOpen.value = true
}

watch(isDialogOpen, (open) => {
  if (!open) reset()
})

const submitRequest = handleSubmit(async () => {
  try {
    await props.requestMutation.mutateAsync(form.currentPassword)
    success(t('profile.deleteAccount.requestSuccess'))
    isDialogOpen.value = false
  } catch (err) {
    const status = (err as { response?: { status?: number } })?.response?.status
    if (status !== 429) setFieldError('currentPassword', extract(err))
  }
})

async function cancelRequest() {
  try {
    await props.cancelMutation.mutateAsync()
    success(t('profile.deleteAccount.cancelSuccess'))
  } catch (err) {
    notifyError(extract(err))
  }
}
</script>

<template>
  <div>
    <!-- Pending deletion banner -->
    <div v-if="profile.deletionRequestedAt" class="flex items-start justify-between gap-4 bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-sm text-red-700">
        {{ t('profile.deleteAccount.pendingBanner', { date: scheduledForLabel }) }}
      </p>
      <BaseButton size="small" :loading="cancelMutation.isPending.value" class="shrink-0" @click="cancelRequest">
        {{ t('profile.deleteAccount.cancelRequestBtn') }}
      </BaseButton>
    </div>

    <!-- Entry point -->
    <div v-else-if="profile.hasPassword" class="flex items-center justify-between gap-4">
      <div>
        <h3 class="text-sm font-semibold text-gray-900">{{ t('profile.deleteAccount.title') }}</h3>
        <p class="text-xs text-gray-400 mt-0.5">{{ t('profile.deleteAccount.subtitle') }}</p>
      </div>
      <BaseButton type="danger" size="small" class="shrink-0" @click="openDialog">
        {{ t('profile.deleteAccount.button') }}
      </BaseButton>
    </div>

    <el-dialog
      v-model="isDialogOpen"
      :title="t('profile.deleteAccount.confirmTitle')"
      width="440px"
      class="delete-account-dialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <p class="text-sm text-gray-600">{{ t('profile.deleteAccount.confirmIntro') }}</p>
      <p v-if="isLandlord" class="text-sm text-gray-600 mt-2">{{ t('profile.deleteAccount.confirmLandlordNote') }}</p>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="mt-4"
        @submit.prevent="submitRequest"
      >
        <el-form-item :label="t('profile.deleteAccount.passwordLabel')" prop="currentPassword" class="mb-2!">
          <BaseInput v-model="form.currentPassword" type="password" show-password />
        </el-form-item>

        <div class="flex gap-2 pt-3">
          <BaseButton type="danger" :loading="isSubmitting" native-type="submit" class="flex-1">
            {{ t('profile.deleteAccount.confirmSubmit') }}
          </BaseButton>
          <BaseButton class="flex-1" @click="isDialogOpen = false">
            {{ t('profile.deleteAccount.cancelBtn') }}
          </BaseButton>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
