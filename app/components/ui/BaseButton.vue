<!-- components/ui/BaseButton.vue -->
<script setup lang="ts">
defineProps<{
  label?: string
  type?: 'primary' | 'success' | 'warning' | 'danger'
  loading?: boolean
}>()
</script>

<template>
  <el-button
    :type="type || 'primary'"
    :loading="loading"
    class="w-full"
  >
    <slot>{{ label }}</slot>
  </el-button>
</template>
