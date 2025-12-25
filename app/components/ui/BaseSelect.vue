<!-- components/ui/BaseSelect.vue -->
<script setup lang="ts">
defineProps<{
  modelValue: string | number
  options: { label: string; value: any }[]
  placeholder?: string
}>()

defineEmits(['update:modelValue'])
</script>

<template>
  <el-select
    :placeholder="placeholder"
    :model-value="modelValue"
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
