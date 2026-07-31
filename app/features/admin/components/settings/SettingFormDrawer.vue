<script setup lang="ts">
import type { FormRules } from 'element-plus'
import type { UseMutationReturnType } from '@tanstack/vue-query'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseDrawer from '~/components/ui/BaseDrawer.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import type { CreateSettingPayload, SettingValue, UpdateCustomSettingPayload } from '../../types/settings'

const props = defineProps<{
  modelValue: boolean
  editItem: { key: string, value: SettingValue } | null
  createMutation: UseMutationReturnType<unknown, unknown, CreateSettingPayload, unknown>
  updateMutation: UseMutationReturnType<unknown, unknown, UpdateCustomSettingPayload, unknown>
}>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const isEditMode = computed(() => !!props.editItem)

const valueTypeOptions = computed(() => [
  { label: t('admin.settings.custom.form.valueTypeString'), value: 'string' as const },
  { label: t('admin.settings.custom.form.valueTypeNumber'), value: 'number' as const },
  { label: t('admin.settings.custom.form.valueTypeBoolean'), value: 'boolean' as const },
  { label: t('admin.settings.custom.form.valueTypeJson'), value: 'json' as const },
])

// Plain object, not a computed: useForm's staticRules param does a direct property
// lookup rather than unwrapping a ref, so a computed() here would silently discard
// these rules. The validators read isEditMode.value live at validation time instead.
const rules: FormRules = {
  key: [{
    validator: (_rule, value: string, callback) => {
      if (!isEditMode.value && !value) callback(new Error(t('admin.settings.custom.form.keyRequired')))
      else callback()
    },
    trigger: 'blur',
  }],
  group: [{
    validator: (_rule, value: string, callback) => {
      if (!isEditMode.value && !value) callback(new Error(t('admin.settings.custom.form.groupRequired')))
      else callback()
    },
    trigger: 'blur',
  }],
}

const {
  formRef,
  form,
  rules: formRules,
  isSubmitting,
  handleSubmit,
  setFieldError,
  reset,
} = useForm(
  {
    key: '',
    group: '',
    valueType: 'string' as 'string' | 'number' | 'boolean' | 'json',
    stringValue: '',
    numberValue: 0,
    booleanValue: false,
    jsonValue: '',
  },
  rules,
)

const valueProp = computed(() => `${form.valueType}Value` as 'stringValue' | 'numberValue' | 'booleanValue' | 'jsonValue')

function detectValueType(value: SettingValue): 'string' | 'number' | 'boolean' | 'json' {
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  return 'json'
}

watch(() => props.editItem, (item) => {
  if (!item) return
  form.key = item.key
  form.valueType = detectValueType(item.value)
  if (form.valueType === 'string') form.stringValue = item.value as string
  else if (form.valueType === 'number') form.numberValue = item.value as number
  else if (form.valueType === 'boolean') form.booleanValue = item.value as boolean
  else form.jsonValue = JSON.stringify(item.value, null, 2)
}, { immediate: true })

watch(isOpen, (open) => {
  if (!open) reset()
})

const submit = handleSubmit(async () => {
  let value: SettingValue
  if (form.valueType === 'string') {
    value = form.stringValue
  } else if (form.valueType === 'number') {
    value = form.numberValue
  } else if (form.valueType === 'boolean') {
    value = form.booleanValue
  } else {
    try {
      value = JSON.parse(form.jsonValue)
    } catch {
      setFieldError('jsonValue', t('admin.settings.custom.invalidJson'))
      return
    }
  }

  try {
    if (isEditMode.value) {
      await props.updateMutation.mutateAsync({ [form.key]: value })
      success(t('admin.settings.custom.updateSuccess'))
    } else {
      await props.createMutation.mutateAsync({ key: form.key, group: form.group, value })
      success(t('admin.settings.custom.createSuccess'))
    }
    isOpen.value = false
  } catch (err) {
    const message = extract(err)
    if (/key/i.test(message)) setFieldError('key', message)
    else if (/group/i.test(message)) setFieldError('group', message)
    else notifyError(message)
  }
})
</script>

<template>
  <BaseDrawer
    v-model="isOpen"
    :title="isEditMode ? t('admin.settings.custom.drawer.editTitle') : t('admin.settings.custom.drawer.title')"
    size="420px"
    direction="rtl"
    :destroy-on-close="true"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-position="top"
      class="space-y-1"
      @submit.prevent="submit"
    >
      <el-form-item :label="t('admin.settings.custom.form.key')" prop="key">
        <BaseInput v-model="form.key" :disabled="isEditMode" />
      </el-form-item>

      <el-form-item v-if="!isEditMode" :label="t('admin.settings.custom.form.group')" prop="group">
        <BaseInput v-model="form.group" />
      </el-form-item>

      <el-form-item :label="t('admin.settings.custom.form.valueType')">
        <el-radio-group v-model="form.valueType" :disabled="isEditMode">
          <el-radio-button v-for="opt in valueTypeOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="t('admin.settings.custom.form.value')" :prop="valueProp">
        <BaseInput v-if="form.valueType === 'string'" v-model="form.stringValue" />
        <el-input-number v-else-if="form.valueType === 'number'" v-model="form.numberValue" class="w-full" controls-position="right" />
        <el-switch v-else-if="form.valueType === 'boolean'" v-model="form.booleanValue" />
        <BaseInput v-else v-model="form.jsonValue" type="textarea" :rows="4" placeholder='{"foo": "bar"}' />
      </el-form-item>

      <div class="flex gap-2 pt-4">
        <BaseButton type="primary" :loading="isSubmitting" native-type="submit" class="flex-1">
          {{ isEditMode ? t('admin.settings.custom.form.save') : t('admin.settings.custom.form.create') }}
        </BaseButton>
        <BaseButton class="flex-1" @click="isOpen = false">
          {{ t('admin.settings.custom.form.cancel') }}
        </BaseButton>
      </div>
    </el-form>
  </BaseDrawer>
</template>
