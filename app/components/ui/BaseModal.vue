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
    class="base-modal"
    @close="$emit('update:modelValue', false)"
  >
    <slot />
  </el-dialog>
</template>

<style scoped>
@media (max-width: 640px) {
  :deep(.base-modal.el-dialog) {
    width: 92vw !important;
  }
}
</style>
