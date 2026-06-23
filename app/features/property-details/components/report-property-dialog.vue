<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import { usePropertyReport } from '../composable/usePropertyReport'

const props = defineProps<{ propertyId: string }>()

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()
const { report } = usePropertyReport()

const isOpen = ref(false)

const rules: FormRules = {
  description: [
    { required: true, message: () => t('property.reportDialog.descriptionRequired'), trigger: 'blur' },
    { min: 10, message: () => t('property.reportDialog.descriptionMin'), trigger: 'blur' },
  ],
}

const {
  formRef,
  form,
  isSubmitting,
  handleSubmit,
  setFieldError,
  reset,
} = useForm({ description: '' }, rules)

watch(isOpen, (open) => {
  if (!open) reset()
})

const submit = handleSubmit(async () => {
  try {
    await report(props.propertyId, form.description)
    success(t('property.reportDialog.submitSuccess'))
    isOpen.value = false
  } catch (err) {
    setFieldError('description', extract(err))
  }
})

function open() {
  isOpen.value = true
}

defineExpose({ open })
</script>

<template>
  <el-dialog
    v-model="isOpen"
    :title="t('property.reportDialog.title')"
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
      <el-form-item :label="t('property.reportDialog.descriptionLabel')" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          :placeholder="t('property.reportDialog.descriptionPlaceholder')"
          :maxlength="1000"
          show-word-limit
        />
      </el-form-item>

      <p class="text-xs text-gray-400 mt-1">{{ t('property.reportDialog.rateLimit') }}</p>

      <div class="flex gap-2 pt-3">
        <el-button type="danger" :loading="isSubmitting" native-type="submit" class="flex-1">
          {{ t('property.reportDialog.submit') }}
        </el-button>
        <el-button class="flex-1" @click="isOpen = false">
          {{ t('property.reportDialog.cancel') }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
