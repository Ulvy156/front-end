<!-- components/ui/BaseSelect.vue -->
<script setup lang="ts">
defineProps<{
  modelValue: string | number
  options: { label: string; value: any }[]
  placeholder?: string
  disabled?: boolean
}>()

defineEmits(['update:modelValue'])
</script>

<template>
  <el-select
    :placeholder="placeholder"
    :model-value="modelValue"
    :disabled="disabled"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <el-option
      v-for="opt in options"
      :key="opt.value"
      :label="opt.label"
      :value="opt.value"
    />
  </el-select>
</template>
