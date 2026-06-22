<script setup lang="ts">
import LandlordPropertiesView from '~/features/landlord/components/properties/landlord-properties-view.vue'

definePageMeta({ middleware: 'landlord', layout: 'landlord' })
</script>

<template>
  <LandlordPropertiesView />
</template>
