<template>
  <section>
    <appBg :total-listings="totalListings" />
    <section class="w-[91%] m-auto grid grid-cols-1 gap-y-5">
      <!-- feature product -->
      <featureProduct :featuredListings="data?.featuredListings ?? []"/>
      <!-- latest product -->
      <latestProduct :latestListings="data?.latestListings ?? []"/>
      <!-- locations section -->
      <locationsSection :popularLocations="data?.popularLocations ?? []" :isLoading="pending"/>
      <!-- why choose us -->
      <whyChoseUs/>
      <!-- how it work -->
      <howItWork/>
      <!-- landlord -->
      <!-- <lanlordSection/> -->
    </section>
  </section>
</template>

<script lang="ts" setup>
import featureProduct from '~/features/home/featured-listings/feature-properties.vue';
import appBg from '~/features/home/components/app-bg.vue';
import latestProduct from '~/features/home/latest-listings/latest-product.vue';
import { useHomePageData } from '~/features/home/composable/useHomePageData';
// import lanlordSection from '~/features/home/components/lanlord-section.vue';

// Below-the-fold sections: defer hydration until they scroll into view
const locationsSection = defineLazyHydrationComponent('visible', () => import('~/features/home/popular-locations/locations-section.vue'));
const whyChoseUs = defineLazyHydrationComponent('visible', () => import('~/features/home/components/why-chose-us.vue'));
const howItWork = defineLazyHydrationComponent('visible', () => import('~/features/home/components/how-it-work.vue'));

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

const { data, pending } = useHomePageData();

const totalListings = computed(() =>
  (data.value?.featuredListings?.length ?? 0) + (data.value?.latestListings?.length ?? 0)
)
</script>

<style scoped></style>
