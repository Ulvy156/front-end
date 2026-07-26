<script setup lang="ts">
import AdminLegalView from '~/features/admin/components/legal/AdminLegalView.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })
</script>

<template>
  <AdminLegalView />
</template>
