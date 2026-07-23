<template>
  <section class="w-full my-5">
    <h2 class="text-[29px] font-extrabold tracking-[-0.02em] mb-1.5">{{ t('home.location.title') }}</h2>
    <p class="text-(--gray) text-[15px] mb-5">{{ t('home.location.subtitle') }}</p>

    <p v-if="!isLoading && popularLocations.length === 0" class="text-(--gray) text-[14px]">
      {{ t('home.location.empty') }}
    </p>

    <div v-else class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4.5">
      <button
        v-for="loc in popularLocations"
        :key="loc.districtId"
        type="button"
        class="location-card"
        @click="goToLocation(loc)"
      >
        <div class="w-11.5 h-11.5 rounded-full bg-(--nav-active) flex items-center justify-center shrink-0">
          <BaseIconClient name="map-pin" :size="22" class="text-(--nav-active-item)" />
        </div>
        <div class="flex-1 min-w-0">
          <div :title="loc.nameEn" class="font-bold text-[15.5px] text-gray-900 truncate">{{ loc.nameEn }}</div>
          <div :title="loc.nameKh" class="kh text-[13px] text-(--gray) mt-px truncate">{{ loc.nameKh }}</div>
        </div>
        <div class="text-right shrink-0">
          {{ t('home.location.homes', loc.totalListings, { n: loc.totalListings }) }}
        </div>
      </button>

      <BaseSkeleton
        v-for="n in 4"
        v-show="isLoading && popularLocations.length === 0"
        :key="n"
        class="location-card"
        leading="circle"
        leading-size="46px"
        :rows="1"
        :lines="2"
      >
        <div class="flex items-center gap-3.5 w-full">
          <el-skeleton-item variant="circle" style="width: 46px; height: 46px; flex-shrink: 0;" />
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <el-skeleton-item variant="text" style="width: 60%; height: 14px;" />
            <el-skeleton-item variant="text" style="width: 40%; height: 12px;" />
          </div>
          <el-skeleton-item variant="text" style="width: 32px; height: 20px;" />
        </div>
      </BaseSkeleton>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import type { PopularDistrict } from '../featured-listings/feature.listings'

const { t } = useI18n()

withDefaults(
  defineProps<{
    popularLocations: PopularDistrict[]
    isLoading?: boolean
  }>(),
  {
    isLoading: false,
  },
)

const filterStore = usePropertyFilterStore()

function goToLocation(loc: PopularDistrict) {
  filterStore.location = loc.districtId
  filterStore.locationType = 'district'
  filterStore.locationName = `${loc.nameEn} — ${loc.nameKh}`
  filterStore.page = 1
  navigateTo('/properties')
}
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
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.location-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.location-card:focus-visible {
  outline: 2px solid var(--nav-active-item);
  outline-offset: 2px;
}
</style>
