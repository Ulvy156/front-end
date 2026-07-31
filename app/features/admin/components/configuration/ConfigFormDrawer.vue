<script setup lang="ts">
import type { FormRules } from 'element-plus'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseDrawer from '~/components/ui/BaseDrawer.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import type { ConfigFieldDef } from '../../types/configuration'

const props = defineProps<{
  modelValue: boolean
  editItem: Record<string, unknown> | null
  fields: ConfigFieldDef[]
  createFn: (payload: Record<string, unknown>) => Promise<unknown>
  updateFn: (payload: Record<string, unknown>) => Promise<unknown>
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

const buildInitial = () => {
  const obj: Record<string, string> = {}
  for (const f of props.fields) obj[f.prop] = ''
  return obj
}

const rules = computed<FormRules>(() => {
  const r: FormRules = {}
  for (const f of props.fields) {
    if (f.required !== false) {
      r[f.prop] = [{ required: true, message: t('admin.config.fieldRequired', { field: f.label }), trigger: 'blur' }]
    }
  }
  return r
})

const {
  formRef,
  form,
  isSubmitting,
  handleSubmit,
  setFieldError,
  reset,
} = useForm(buildInitial(), rules)

watch(() => props.editItem, (item) => {
  if (item) {
    for (const f of props.fields) {
      form[f.prop] = (item[f.prop] as string) ?? ''
    }
  }
}, { immediate: true })

watch(isOpen, (open) => {
  if (!open) reset()
})

const submit = handleSubmit(async () => {
  try {
    if (isEditMode.value) {
      await props.updateFn({ id: props.editItem!.id, ...form })
      success(t('admin.config.updateSuccess'))
    } else {
      await props.createFn({ ...form })
      success(t('admin.config.createSuccess'))
    }
    isOpen.value = false
  } catch (err) {
    const firstField = props.fields[0]?.prop ?? 'nameEn'
    setFieldError(firstField, extract(err))
  }
})
</script>

<template>
  <BaseDrawer
    v-model="isOpen"
    :title="isEditMode ? $t('admin.config.edit') : $t('admin.config.create')"
    size="420px"
    direction="rtl"
    :destroy-on-close="true"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="space-y-1"
      @submit.prevent="submit"
    >
      <el-form-item v-for="field in fields" :key="field.prop" :label="field.label" :prop="field.prop">
        <BaseInput v-model="form[field.prop]" :placeholder="field.placeholder ?? field.label" />
      </el-form-item>

      <div class="flex gap-2 pt-4">
        <BaseButton type="primary" :loading="isSubmitting" native-type="submit" class="flex-1">
          {{ isEditMode ? $t('admin.config.save') : $t('admin.config.create') }}
        </BaseButton>
        <BaseButton class="flex-1" @click="isOpen = false">
          {{ $t('admin.config.cancel') }}
        </BaseButton>
      </div>
    </el-form>
  </BaseDrawer>
</template>
