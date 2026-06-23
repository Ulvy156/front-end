<script setup lang="ts">
import type { FormRules } from 'element-plus'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import { useFeedback } from '../composables/useFeedback'

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()
const { submit: submitFeedback } = useFeedback()

const isOpen = ref(false)

const typeOptions = [
  { value: 'BUG', label: () => t('feedback.types.bug'), icon: 'bug' },
  { value: 'SUGGESTION', label: () => t('feedback.types.suggestion'), icon: 'lightbulb' },
  { value: 'OTHER', label: () => t('feedback.types.other'), icon: 'message-circle' },
] as const

const rules: FormRules = {
  type: [{ required: true, message: () => t('feedback.typeRequired'), trigger: 'change' }],
  description: [
    { required: true, message: () => t('feedback.descriptionRequired'), trigger: 'blur' },
    { min: 10, message: () => t('feedback.descriptionMin'), trigger: 'blur' },
  ],
}

const {
  formRef,
  form,
  isSubmitting,
  handleSubmit,
  setFieldError,
  reset,
} = useForm({ type: 'BUG' as string, description: '' }, rules)

watch(isOpen, (open) => {
  if (!open) reset()
})

const submit = handleSubmit(async () => {
  try {
    await submitFeedback({
      type: form.type as 'BUG' | 'SUGGESTION' | 'OTHER',
      description: form.description,
    })
    success(t('feedback.submitSuccess'))
    isOpen.value = false
  } catch (err) {
    setFieldError('description', extract(err))
  }
})
</script>

<template>
  <!-- Floating button -->
  <button
    class="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--nav-active-item)] text-white shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105"
    @click="isOpen = true"
  >
    <BaseIcon name="message-square-plus" :size="18" />
    <span class="text-sm font-medium">{{ $t('feedback.button') }}</span>
  </button>

  <!-- Dialog -->
  <el-dialog
    v-model="isOpen"
    :title="$t('feedback.title')"
    width="460px"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="space-y-1"
      @submit.prevent="submit"
    >
      <!-- Type selector -->
      <el-form-item :label="$t('feedback.typeLabel')" prop="type">
        <div class="flex gap-2 w-full">
          <button
            v-for="opt in typeOptions"
            :key="opt.value"
            type="button"
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer"
            :class="form.type === opt.value
              ? 'border-[var(--nav-active-item)] bg-emerald-50 text-[var(--nav-active-item)]'
              : 'border-gray-200 text-gray-500 hover:border-gray-300'"
            @click="form.type = opt.value"
          >
            <BaseIcon :name="opt.icon" :size="15" />
            {{ opt.label() }}
          </button>
        </div>
      </el-form-item>

      <!-- Description -->
      <el-form-item :label="$t('feedback.descriptionLabel')" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          :placeholder="$t('feedback.descriptionPlaceholder')"
          :maxlength="1000"
          show-word-limit
        />
      </el-form-item>

      <p class="text-xs text-gray-400 mt-1">{{ $t('feedback.rateLimit') }}</p>

      <div class="flex gap-2 pt-3">
        <el-button type="primary" :loading="isSubmitting" native-type="submit" class="flex-1">
          {{ $t('feedback.submit') }}
        </el-button>
        <el-button class="flex-1" @click="isOpen = false">
          {{ $t('feedback.cancel') }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
