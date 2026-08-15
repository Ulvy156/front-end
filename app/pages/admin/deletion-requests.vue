<script setup lang="ts">
import AdminDeletionRequestsView from '~/features/admin/components/deletion-requests/AdminDeletionRequestsView.vue'
definePageMeta({ middleware: 'admin', layout: 'admin' })
</script>

<template>
  <AdminDeletionRequestsView />
</template>
