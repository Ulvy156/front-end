<script setup lang="ts">
import AdminFeedbackView from '~/features/admin/components/feedback/AdminFeedbackView.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })
</script>

<template>
  <AdminFeedbackView />
</template>
