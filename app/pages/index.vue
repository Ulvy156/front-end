<template>
  <section>
    <appBg />
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
  keepalive: true,
})

const config = useRuntimeConfig()

useSeoMeta({
  title: 'Rooms for Rent in Cambodia | SabayRent',
  description: 'Find rooms and apartments for rent in Cambodia. Filter by price, location, and nearby places.',
  ogTitle: 'Rooms for Rent in Cambodia',
  ogDescription: 'Browse affordable rooms and apartments for rent in Cambodia.',
  ogType: 'website',
  ogUrl: config.public.BASE_URL,
  ogImage: `${config.public.BASE_URL}/sabayrent-logo.webp`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Rooms for Rent in Cambodia',
  twitterDescription: 'Browse affordable rooms and apartments for rent in Cambodia.',
  twitterImage: `${config.public.BASE_URL}/sabayrent-logo.webp`,
})

const { data, pending } = useHomePageData();

</script>

<style scoped></style>
