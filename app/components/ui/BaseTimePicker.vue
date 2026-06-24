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
    placeholder: 'HH:mm',
    clearable: true,
  },
)

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

function onPick(val: Date | null) {
  if (!val) {
    emit('update:modelValue', '')
    return
  }
  const hours = val.getHours()
  const mm = String(val.getMinutes()).padStart(2, '0')
  const period = hours >= 12 ? 'PM' : 'AM'
  const hh12 = String(hours % 12 || 12).padStart(2, '0')
  emit('update:modelValue', `${hh12}:${mm} ${period}`)
}

function toDate(time: string): Date | undefined {
  if (!time) return undefined
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return undefined
  let hours = Number(match[1])
  const minutes = Number(match[2])
  const period = match[3].toUpperCase()
  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  const d = new Date()
  d.setHours(hours, minutes, 0, 0)
  return d
}
</script>

<template>
  <el-time-picker
    :model-value="toDate(modelValue)"
    :placeholder
    :clearable
    :disabled
    format="hh:mm A"
    :prefix-icon="null"
    @update:model-value="onPick"
  >
    <template #prefix>
      <BaseIconClient name="clock" :size="16" />
    </template>
  </el-time-picker>
</template>
