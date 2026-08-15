<script setup lang="ts">
import LandlordDraftsView from '~/features/property-draft/components/landlord-drafts-view.vue'

definePageMeta({ middleware: 'landlord', layout: 'landlord' })
</script>

<template>
  <LandlordDraftsView />
</template>
