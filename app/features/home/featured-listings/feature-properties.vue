<template>
  <section class="w-full m-auto my-5">
    <div class="flex items-center text-(--nav-active-item) gap-x-3 mb-2">
      <span class="w-10 h-1 bg-(--nav-active-item)"></span>
      <p class="font-bold">{{ $t("home.featured.title") }}</p>
    </div>
    <div class="flex justify-between items-center">
      <div class="grid grid-cols-1 items-center gap-x-2">
        <h3>{{ $t("home.featured.title") }}</h3>
        <p class="text-(--gray)">{{ $t("home.featured.description") }}</p>
      </div>
    </div>
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-3">
      <productCard
        v-for="value in featuredListings"
        :id="value.id"
        :key="value.id"
        :price="value.monthly_price"
        :src="value.images[0]?.imageKey ?? ''"
        :title="value.title"
        :content="value.title"
        :location="value.district"
        :type="value.propertyType"
        :size="value.sizeSqm"
        :total-view="value.totalViews"
        :bathroom="value.bathroom"
        :bedroom="value.bedroom"
        :hide-compare-icon="true"
        :is-available="value.isAvailable"
      />
      <skeletonProperty :is-hide="featuredListings.length > 0"/>
    </section>
  </section>
</template>

<script lang="ts" setup>
import productCard from "../components/product-card.vue";
import type { FeaturedProperty } from "./feature.listings";
import skeletonProperty from "~/components/animation/skeleton-property.vue";

defineProps<{
  featuredListings: FeaturedProperty[];
}>();
</script>
