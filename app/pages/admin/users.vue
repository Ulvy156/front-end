<script setup lang="ts">
import AdminUsersView from '~/features/admin/components/users/AdminUsersView.vue'
definePageMeta({ middleware: 'admin', layout: 'admin' })
</script>

<template>
  <AdminUsersView />
</template>
