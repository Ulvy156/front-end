<template>
  <section>
    <appBg />
    <section class="w-[84%] m-auto grid grid-cols-1 gap-y-5">
      <!-- feature product -->
      <featureProduct :featuredListings="data?.featuredListings ?? []"/>
      <!-- latest product -->
      <latestProduct :latestListings="data?.latestListings ?? []"/>
      <!-- locations section -->
      <locationsSection :popularLocations="data?.popularLocations ?? []"/>
    </section>
  </section>
</template>

<script lang="ts" setup>
import featureProduct from '~/features/home/featured-listings/feature-properties.vue';
import appBg from '~/features/home/components/app-bg.vue';
import locationsSection from '~/features/home/popular-locations/locations-section.vue';
import latestProduct from '~/features/home/latest-listings/latest-product.vue';
import { useHomePageQuery } from '~/features/home/featured-listings/composable/useHomePageQuery';

definePageMeta({
  headerOverlay: true,
})

useSeoMeta({
  title: 'Rooms for Rent in Cambodia | RoomRent',
  description: 'Find rooms and apartments for rent in Cambodia. Filter by price, location, and nearby places.',
  ogTitle: 'Rooms for Rent in Cambodia',
  ogDescription: 'Browse affordable rooms and apartments for rent in Cambodia.',
  ogType: 'website',
  ogUrl: 'https://yourdomain.com',
})

const { data } = useHomePageQuery();


</script>

<style scoped></style>