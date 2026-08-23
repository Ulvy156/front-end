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
import { useSEO } from '~/composables/useSEO';
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
const seo = useSEO()

seo.setSEO({
  title: 'Rooms, Studios, Apartments & Houses for Rent in Cambodia | RokPteah',
  description: 'Find rooms, studios, apartments, houses, and single rooms for rent in Cambodia. Filter by price, location, and nearby places.',
  image: `${config.public.BASE_URL}/sabayrent-logo.webp`,
})

// Organization/WebSite structured data — only added on the home page (not
// per-route via useSEO) since it describes the site as a whole, not one page.
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'RokPteah',
        url: config.public.BASE_URL,
        logo: `${config.public.BASE_URL}/sabayrent-logo.webp`,
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'RokPteah',
        url: config.public.BASE_URL,
      }),
    },
  ],
})

const { data, pending } = useHomePageData();

</script>

<style scoped></style>
