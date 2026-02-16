<template>
    <propertyDetailsSection/>
</template>

<script setup lang="ts">
import propertyDetailsSection from '~/features/property-details/components/property-details-section.vue';
import { useSeoPageMeta } from "#imports";
import { useSEO } from "#imports";

const seoData = useSeoPageMeta();
const SEO = useSEO();

// seo page
SEO.setSEO({
  title: seoData.seoPageData.title,
  description: seoData.seoPageData.description,
  image: seoData.seoPageData.image,
});

</script>