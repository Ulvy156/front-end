<script setup lang="ts">
import type { AxiosError } from 'axios'
import type { FormRules } from 'element-plus'
import type { UseMutationReturnType } from '@tanstack/vue-query'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseDrawer from '~/components/ui/BaseDrawer.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import type { AppSetting, CreateSettingPayload, SettingValue, SettingValueKind, UpdateSettingPayload } from '../../types/settings'

const props = defineProps<{
  modelValue: boolean
  editItem: AppSetting | null
  duplicateFrom?: AppSetting | null
  defaultCategory?: string
  categoryOptions: { label: string, value: string }[]
  createMutation: UseMutationReturnType<AppSetting, unknown, CreateSettingPayload, unknown>
  updateMutation: UseMutationReturnType<AppSetting, unknown, { category: string, key: string, payload: UpdateSettingPayload }, unknown>
}>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean], created: [setting: AppSetting] }>()

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const isEditMode = computed(() => !!props.editItem)

const drawerTitle = computed(() => {
  if (isEditMode.value) return t('admin.settings.drawer.editTitle')
  if (props.duplicateFrom) return t('admin.settings.drawer.duplicateTitle')
  return t('admin.settings.drawer.title')
})

const valueTypeOptions = computed(() => [
  { label: t('admin.settings.form.valueTypeString'), value: 'string' as const },
  { label: t('admin.settings.form.valueTypeNumber'), value: 'number' as const },
  { label: t('admin.settings.form.valueTypeBoolean'), value: 'boolean' as const },
  { label: t('admin.settings.form.valueTypeJson'), value: 'json' as const },
])

// Plain object, not a computed: useForm's staticRules param does a direct property
// lookup rather than unwrapping a ref, so a computed() here would silently discard
// these rules. The validators read isEditMode.value live at validation time instead.
const rules: FormRules = {
  key: [{
    validator: (_rule, value: string, callback) => {
      if (!isEditMode.value && !value) callback(new Error(t('admin.settings.form.keyRequired')))
      else callback()
    },
    trigger: 'blur',
  }],
  category: [{
    validator: (_rule, value: string, callback) => {
      if (!isEditMode.value && !value) callback(new Error(t('admin.settings.form.categoryRequired')))
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
    category: '',
    description: '',
    isPublic: false,
    valueType: 'string' as SettingValueKind,
    stringValue: '',
    numberValue: 0,
    booleanValue: false,
    jsonValue: '',
  },
  rules,
)

const valueProp = computed(() => `${form.valueType}Value` as 'stringValue' | 'numberValue' | 'booleanValue' | 'jsonValue')

function detectValueType(value: SettingValue): SettingValueKind {
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  return 'json'
}

watch(isOpen, (open) => {
  if (!open) { reset(); return }
  const item = props.editItem
  const source = item ?? props.duplicateFrom
  if (source) {
    form.key = item ? item.key : `${source.key}Copy`
    form.category = source.category
    form.description = source.description ?? ''
    form.isPublic = source.isPublic
    form.valueType = detectValueType(source.value)
    if (form.valueType === 'string') form.stringValue = source.value as string
    else if (form.valueType === 'number') form.numberValue = source.value as number
    else if (form.valueType === 'boolean') form.booleanValue = source.value as boolean
    else form.jsonValue = JSON.stringify(source.value, null, 2)
  } else {
    form.category = props.defaultCategory ?? ''
  }
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
      setFieldError('jsonValue', t('admin.settings.invalidJson'))
      return
    }
  }

  const description = form.description.trim() ? form.description.trim() : null

  try {
    if (isEditMode.value && props.editItem) {
      await props.updateMutation.mutateAsync({
        category: props.editItem.category,
        key: props.editItem.key,
        payload: { value, description, isPublic: form.isPublic },
      })
      success(t('admin.settings.updateSuccess'))
    } else {
      const created = await props.createMutation.mutateAsync({
        category: form.category,
        key: form.key,
        value,
        description,
        isPublic: form.isPublic,
      })
      success(t('admin.settings.createSuccess'))
      emit('created', created)
    }
    isOpen.value = false
  } catch (err) {
    const status = (err as AxiosError)?.response?.status
    const message = extract(err)
    if (status === 409) setFieldError('key', t('admin.settings.form.duplicateKey'))
    else if (/key/i.test(message)) setFieldError('key', message)
    else if (/category/i.test(message)) setFieldError('category', message)
    else notifyError(message)
  }
})
</script>

<template>
  <BaseDrawer
    v-model="isOpen"
    :title="drawerTitle"
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
      <el-form-item :label="t('admin.settings.form.key')" prop="key">
        <BaseInput v-model="form.key" :disabled="isEditMode" />
      </el-form-item>

      <el-form-item :label="t('admin.settings.form.category')" prop="category">
        <el-select
          v-model="form.category"
          filterable
          allow-create
          default-first-option
          :disabled="isEditMode"
          :placeholder="t('admin.settings.form.categoryPlaceholder')"
          class="w-full"
        >
          <el-option v-for="opt in categoryOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('admin.settings.form.valueType')">
        <el-radio-group v-model="form.valueType" :disabled="isEditMode">
          <el-radio-button v-for="opt in valueTypeOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="t('admin.settings.form.value')" :prop="valueProp">
        <BaseInput v-if="form.valueType === 'string'" v-model="form.stringValue" />
        <el-input-number v-else-if="form.valueType === 'number'" v-model="form.numberValue" class="w-full" controls-position="right" />
        <el-switch v-else-if="form.valueType === 'boolean'" v-model="form.booleanValue" />
        <BaseInput v-else v-model="form.jsonValue" type="textarea" :rows="4" placeholder='{"foo": "bar"}' />
      </el-form-item>

      <el-form-item :label="t('admin.settings.form.description')">
        <BaseInput v-model="form.description" type="textarea" :rows="2" />
      </el-form-item>

      <el-form-item :label="t('admin.settings.form.isPublic')">
        <div class="flex items-center gap-2">
          <el-switch v-model="form.isPublic" />
          <span class="text-xs text-gray-400">{{ t('admin.settings.form.isPublicHint') }}</span>
        </div>
      </el-form-item>

      <div class="flex gap-2 pt-4">
        <BaseButton type="primary" :loading="isSubmitting" native-type="submit" class="flex-1">
          {{ isEditMode ? t('admin.settings.form.save') : t('admin.settings.form.create') }}
        </BaseButton>
        <BaseButton class="flex-1" @click="isOpen = false">
          {{ t('admin.settings.form.cancel') }}
        </BaseButton>
      </div>
    </el-form>
  </BaseDrawer>
</template>
