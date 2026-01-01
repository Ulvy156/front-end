<template>
  <section>
    <appBg />
    <section class="w-[84%] m-auto grid grid-cols-1 gap-y-5">
      <!-- feature product -->
      <featureProduct />
      <!-- latest product -->
      <latestProduct />
      <!-- locations section -->
      <locationsSection />
    </section>
  </section>
</template>

<script lang="ts" setup>
import featureProduct from '~/features/home/featured-listings/feature-product.vue';
import appBg from '~/features/home/components/app-bg.vue';
import locationsSection from '~/features/home/popular-locations/locations-section.vue';
import latestProduct from '~/features/home/latest-listings/latest-product.vue';


useSeoMeta({
  title: 'Rooms for Rent in Cambodia | RoomRent',
  description: 'Find rooms and apartments for rent in Cambodia. Filter by price, location, and nearby places.',
  ogTitle: 'Rooms for Rent in Cambodia',
  ogDescription: 'Browse affordable rooms and apartments for rent in Cambodia.',
  ogType: 'website',
  ogUrl: 'https://yourdomain.com',
})
</script>

<style scoped></style>