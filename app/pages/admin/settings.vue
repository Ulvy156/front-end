<script setup lang="ts">
import AdminSettingsView from '~/features/admin/components/settings/AdminSettingsView.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })
</script>

<template>
  <AdminSettingsView />
</template>
