<!-- components/ui/BasePagination.vue -->
<script setup lang="ts">
defineProps<{ total: number; page: number }>()
defineEmits(['update:page'])
</script>

<template>
  <el-pagination
    background
    layout="prev, pager, next"
    :total="total"
    :current-page="page"
    @current-change="$emit('update:page', $event)"
  />
</template>
