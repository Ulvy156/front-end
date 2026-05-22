<script setup lang="ts">
import AdminLandlordsView from '~/features/admin/components/landlords/AdminLandlordsView.vue'
definePageMeta({ middleware: 'admin', layout: 'admin' })
</script>

<template>
  <AdminLandlordsView />
</template>
