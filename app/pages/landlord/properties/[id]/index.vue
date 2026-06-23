<script setup lang="ts">
import LandlordPropertyDetail from '~/features/landlord/components/properties/landlord-property-detail.vue'

definePageMeta({ middleware: 'landlord', layout: 'landlord' })
</script>

<template>
  <LandlordPropertyDetail />
</template>
