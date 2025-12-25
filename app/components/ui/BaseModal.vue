<!-- components/ui/BaseModal.vue -->
<script setup lang="ts">
defineProps<{ modelValue: boolean; title?: string }>()
defineEmits(['update:modelValue'])
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    width="500px"
    @close="$emit('update:modelValue', false)"
  >
    <slot />
  </el-dialog>
</template>
