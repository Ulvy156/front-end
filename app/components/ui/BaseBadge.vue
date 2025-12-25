<!-- components/ui/BaseBadge.vue -->
<script setup lang="ts">
defineProps<{ type?: 'success' | 'warning' | 'danger' }>()
</script>

<template>
  <el-tag :type="type || 'info'">
    <slot />
  </el-tag>
</template>
