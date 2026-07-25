<template>
  <section class="w-full my-5">
    <div class="flex items-end justify-between mb-5">
      <h2 class="text-[29px] font-extrabold tracking-[-0.02em]">{{ t('home.latestListings') }}</h2>
      <NuxtLink to="/properties" class="text-(--nav-active-item) font-bold text-[15px] no-underline hover:underline">
        {{ t('home.featured.viewAll') }} →
      </NuxtLink>
    </div>
    <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NuxtLink
        v-for="item in latestListings"
        :key="item.id"
        :to="`/properties/details/${item.id}`"
        class="latest-card"
      >
        <div class="relative w-[148px] shrink-0 overflow-hidden rounded-l-xl">
          <BaseImage
            :src="item.images[0]?.imageKey ?? ''"
            class="w-full h-full object-cover"
            :width="148"
            :height="160"
            sizes="148px"
          />
          <span class="absolute top-2.5 left-2.5 bg-white text-(--nav-active-item) text-[11px] font-bold px-2.5 py-1 rounded-full">
            {{ t('home.featured.justListed').toUpperCase() }}
          </span>
        </div>
        <div class="p-4 flex-1 min-w-0">
          <div class="flex items-baseline gap-1 mb-1.5">
            <span class="text-xl font-extrabold text-(--nav-active-item)">${{ item.monthly_price.toLocaleString() }}</span>
            <span class="text-[12.5px] font-semibold text-(--gray)">/ {{ t('property.month') }}</span>
          </div>
          <h3 class="text-[15.5px] font-bold leading-snug mb-1.5 truncate">{{ item.title }}</h3>
          <div class="flex items-center gap-1.5 text-(--gray) text-[13px] mb-3">
            <BaseIconClient name="map-pin" :size="13" class="text-(--nav-active-item)" />
            {{ item.district[langKey] }}, {{ item.district.province[langKey] }}
          </div>
          <div class="flex gap-3.5 text-[13px] font-semibold text-gray-900">
            <span>{{ item.bedroom }} Beds</span>
            <span class="text-gray-200">·</span>
            <span>{{ item.bathroom }} Baths</span>
            <span class="text-gray-200">·</span>
            <span>{{ item.sizeSqm }} m²</span>
          </div>
        </div>
      </NuxtLink>

      <skeletonProperty v-if="latestListings.length === 0" :number-of-items="2" variant="horizontal" />
    </section>
  </section>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseImage from '~/components/ui/BaseImage.vue'
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'
import type { FeaturedProperty } from '../featured-listings/feature.listings'

// Data is already resolved server-side by the time this renders, so the
// skeleton (and its el-skeleton CSS chunk, render-blocking per Lighthouse)
// is only ever needed on a rare empty-state — load it on demand instead of
// bundling it into every homepage visit.
const skeletonProperty = defineAsyncComponent(() => import('~/components/animation/skeleton-property.vue'))

const { t } = useI18n()
const langKey = useLangKey()

defineProps<{
  latestListings: FeaturedProperty[]
}>()
</script>

<style scoped>
.latest-card {
  display: flex;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #ECEFED;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.latest-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
</style>
