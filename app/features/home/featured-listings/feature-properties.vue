<template>
  <section class="w-full my-5">
    <div class="flex items-end justify-between mb-5">
      <div>
        <div class="flex items-center gap-2 text-(--nav-active-item) font-bold text-[13px] uppercase tracking-[0.07em] mb-1.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/></svg>
          {{ t('home.featured.badge') }}
        </div>
        <h2 class="text-[29px] font-extrabold tracking-[-0.02em]">{{ t('home.featured.title') }}</h2>
      </div>
      <NuxtLink to="/properties" class="text-(--nav-active-item) font-bold text-[15px] no-underline hover:underline">
        {{ t('home.featured.viewAll') }} →
      </NuxtLink>
    </div>
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        :photo-count="value._count?.images ?? value.images?.length ?? 0"
        :bathroom="value.bathroom"
        :bedroom="value.bedroom"
        :hide-compare-icon="true"
        :is-available="value.isAvailable"
      />
      <skeletonProperty :is-hide="featuredListings.length > 0" />
    </section>
  </section>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import productCard from '../components/product-card.vue'
import type { FeaturedProperty } from './feature.listings'
import skeletonProperty from '~/components/animation/skeleton-property.vue'

const { t } = useI18n()

defineProps<{
  featuredListings: FeaturedProperty[]
}>()
</script>
