<!-- components/ui/BaseEmpty.vue -->
<template>
  <el-empty :description="description" />
</template>

<script setup lang="ts">
withDefaults(defineProps<{ description?: string }>(), {
  description: 'No data found',
})
</script>
