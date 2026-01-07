<!-- components/ui/BaseBadge.vue -->
<script setup lang="ts">
defineProps<{ type?: 'primary' | 'success' | 'warning' | 'danger' | 'info', content: string| number }>()
</script>

<template>
  <el-tag :type="type || 'info'">
    <div class="flex items-center gap-x-1">
      <slot></slot>
      {{content}}
    </div>
  </el-tag>
</template>
