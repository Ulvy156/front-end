<script setup lang="ts">
import BaseIconClient from './BaseIcon.client.vue'

withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    clearable?: boolean
    disabled?: boolean
    disabledDate?: (date: Date) => boolean
  }>(),
  {
    placeholder: 'YYYY-MM-DD',
    clearable: true,
  },
)

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

function onPick(val: string | null) {
  emit('update:modelValue', val ?? '')
}
</script>

<template>
  <el-date-picker
    :model-value="modelValue"
    :placeholder
    :clearable
    :disabled
    :disabled-date="disabledDate"
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
