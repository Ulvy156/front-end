<!-- components/ui/BaseInput.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import BaseIconClient from './BaseIcon.client.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    placeholder?: string
    type?: 'text' | 'textarea' | 'number' | 'password' | 'email' | 'search' | 'tel' | 'url'
    icon?: string
    size?: 'large' | 'default' | 'small'
    clearable?: boolean
    disabled?: boolean
    readonly?: boolean
    rows?: number
    maxlength?: number | string
    /** digits only */
    numeric?: boolean
    /** allow one decimal point (needs numeric) */
    decimal?: boolean
  }>(),
  {
    type: 'text',
    size: 'default',
  }
)

defineEmits(['update:modelValue'])

const clean = (v: unknown) => {
  const s = String(v ?? '')
  if (!props.decimal) return s.replace(/\D/g, '')
  // keep digits + first dot only
  const digits = s.replace(/[^\d.]/g, '').replace(/^(\d*\.?\d*).*$/, '$1')
  // drop leading zeros (e.g. "05" -> "5"), but keep a lone "0" or "0.x" —
  // only meaningful for decimal (measurement/money) fields; non-decimal
  // numeric fields like phone numbers can have a semantically required
  // leading zero (e.g. "012345678").
  return digits.replace(/^0+(?=\d)/, '')
}

// EP only applies parser when formatter is also set
const formatter = computed(() => (props.numeric ? clean : undefined))
const parser = computed(() => (props.numeric ? clean : undefined))

// force text so we don't inherit number-input's e/+/- garbage
const resolvedType = computed(() => (props.numeric ? 'text' : props.type))
const inputmode = computed(() =>
  props.numeric ? (props.decimal ? 'decimal' : 'numeric') : undefined
)
</script>

<template>
  <el-input
    :type="resolvedType"
    :inputmode
    :formatter
    :parser
    :placeholder
    :size
    :clearable
    :disabled
    :readonly
    :rows
    :maxlength
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-if="icon" #prefix>
      <BaseIconClient :name="icon" />
    </template>
  </el-input>
</template>