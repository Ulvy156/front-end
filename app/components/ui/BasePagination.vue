<template>
  <el-pagination
    background
    layout="prev, pager, next"
    :total="total"
    :page-size="pageSize"
    :current-page="currentPage"
    @current-change="onChange"
  />
</template>

<script setup lang="ts">
defineProps<{
  total: number
  pageSize?: number
  currentPage: number
}>()

const emit = defineEmits<{
  (e: 'update:currentPage', value: number): void
}>()

function onChange(page: number) {
  emit('update:currentPage', page)
}
</script>
