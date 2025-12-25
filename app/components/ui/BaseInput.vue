<!-- components/ui/BaseInput.vue -->
<script setup lang="ts">
defineProps<{
  modelValue: string | number
  placeholder?: string
  type?: string
}>()

defineEmits(['update:modelValue'])
</script>

<template>
  <el-input
    :type="type || 'text'"
    :placeholder="placeholder"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
