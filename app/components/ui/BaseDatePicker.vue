<script setup lang="ts">
import BaseIconClient from './BaseIcon.client.vue'

withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    clearable?: boolean
    disabled?: boolean
  }>(),
  {
    placeholder: 'YYYY-MM-DD',
    clearable: true,
  },
)

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

function onPick(val: Date | null) {
  if (!val) {
    emit('update:modelValue', '')
    return
  }
  const y = val.getFullYear()
  const m = String(val.getMonth() + 1).padStart(2, '0')
  const d = String(val.getDate()).padStart(2, '0')
  emit('update:modelValue', `${y}-${m}-${d}`)
}

function toDate(date: string): Date | undefined {
  if (!date) return undefined
  const d = new Date(date)
  return isNaN(d.getTime()) ? undefined : d
}
</script>

<template>
  <el-date-picker
    :model-value="toDate(modelValue)"
    :placeholder
    :clearable
    :disabled
    type="date"
    format="YYYY-MM-DD"
    value-format="YYYY-MM-DD"
    :prefix-icon="null"
    @update:model-value="onPick"
  >
    <template #prefix>
      <BaseIconClient name="calendar" :size="16" />
    </template>
  </el-date-picker>
</template>
