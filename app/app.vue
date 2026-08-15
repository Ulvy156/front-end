<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <MaintenanceOverlay />
</template>

<script setup lang="ts">
const { locale } = useI18n()
useHead(() => ({
  htmlAttrs: {
    lang: locale.value,
  },
}))
</script>

