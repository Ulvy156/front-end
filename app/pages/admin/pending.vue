<script setup lang="ts">
import AdminPropertiesView from '~/features/admin/components/properties/AdminPropertiesView.vue'
definePageMeta({ middleware: 'admin', layout: 'admin' })
</script>

<template>
  <AdminPropertiesView preset-filter="pending" />
</template>
