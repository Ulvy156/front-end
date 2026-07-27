<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'
import { usePropertyReport, type ReportType } from '../composable/usePropertyReport'

const props = defineProps<{ propertyId: string }>()

const { t } = useI18n()
const langKey = useLangKey()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()
const { report, fetchReportTypes } = usePropertyReport()

const isOpen = ref(false)
const reportTypes = ref<ReportType[]>([])

const rules: FormRules = {
  reportTypeId: [
    { required: true, message: () => t('property.reportDialog.typeRequired'), trigger: 'change' },
  ],
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
} = useForm({ reportTypeId: null as number | null, description: '' }, rules)

watch(isOpen, async (open) => {
  if (open) {
    if (!reportTypes.value.length) {
      try {
        reportTypes.value = await fetchReportTypes()
      } catch {}
    }
  } else {
    reset()
  }
})

const submit = handleSubmit(async () => {
  try {
    await report(props.propertyId, {
      reportTypeId: form.reportTypeId!,
      description: form.description,
    })
    success(t('property.reportDialog.submitSuccess'))
    isOpen.value = false
  } catch (err) {
    const status = (err as { response?: { status?: number } })?.response?.status
    if (status !== 429) setFieldError('description', extract(err))
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
    width="500px"
    class="report-property-dialog"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="space-y-1"
      @submit.prevent="submit"
    >
      <el-form-item :label="t('property.reportDialog.typeLabel')" prop="reportTypeId">
        <div class="grid grid-cols-2 gap-2 w-full">
          <div
            v-for="rt in reportTypes"
            :key="rt.id"
            class="flex items-center gap-2 px-3 py-2.5 border rounded-lg cursor-pointer transition-colors"
            :class="form.reportTypeId === rt.id
              ? 'border-red-400 bg-red-50 text-red-700'
              : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'"
            @click="form.reportTypeId = rt.id"
          >
            <BaseIconClient :name="rt.icon" :size="16" />
            <span class="text-sm font-medium">{{ rt[langKey] }}</span>
          </div>
        </div>
      </el-form-item>

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

      <p class="text-xs text-gray-600 mt-1">{{ t('property.reportDialog.rateLimit') }}</p>

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

<style scoped>
@media (max-width: 640px) {
  :deep(.report-property-dialog.el-dialog) {
    width: 92vw !important;
  }
}
</style>
