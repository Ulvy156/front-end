<template>
  <section class="w-full my-5">
    <h2 class="text-[29px] font-extrabold tracking-[-0.02em] mb-1.5">{{ t('home.location.title') }}</h2>
    <p class="text-(--gray) text-[15px] mb-5">{{ t('home.location.subtitle') }}</p>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4.5">
      <NuxtLink
        v-for="loc in popularLocations"
        :key="loc.districtId"
        to="/properties"
        class="location-card"
      >
        <div class="w-11.5 h-11.5 rounded-full bg-(--nav-active) flex items-center justify-center shrink-0">
          <BaseIconClient name="map-pin" :size="22" class="text-(--nav-active-item)" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-[15.5px] text-gray-900 truncate">{{ loc.nameEn }}</div>
          <div class="kh text-[13px] text-(--gray) mt-px truncate">{{ loc.nameKh }}</div>
        </div>
        <div class="text-right shrink-0">
          <div class="font-extrabold text-lg text-(--nav-active-item)">{{ loc.totalListings }}</div>
          <div class="text-[11px] text-(--gray) font-semibold">{{ t('home.location.homes') }}</div>
        </div>
      </NuxtLink>

      <skeletonProperty :number-of-items="4" :is-hide="popularLocations.length > 0" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'
import type { PopularDistrict } from '../featured-listings/feature.listings'
import skeletonProperty from '~/components/animation/skeleton-property.vue'

const { t } = useI18n()

defineProps<{
  popularLocations: PopularDistrict[]
}>()
</script>

<style scoped>
.kh {
  font-family: 'Noto Sans Khmer', 'Manrope', sans-serif;
}

.location-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff;
  border: 1px solid #ECEFED;
  border-radius: 12px;
  padding: 16px 18px;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.location-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
</style>
