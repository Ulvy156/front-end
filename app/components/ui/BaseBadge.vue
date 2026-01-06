<!-- components/ui/BaseBadge.vue -->
<script setup lang="ts">
defineProps<{ type?: 'primary' | 'success' | 'warning' | 'danger' | 'info', content: string| number }>()
</script>

<template>
  <el-tag :type="type || 'info'">
    {{content}}
  </el-tag>
</template>
