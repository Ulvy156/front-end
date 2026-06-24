<script setup lang="ts">
import AdminReportsView from '~/features/admin/components/reports/AdminReportsView.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })
</script>

<template>
  <AdminReportsView />
</template>
