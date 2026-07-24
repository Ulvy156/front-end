<template>
  <section>
    <h3 class="text-lg font-semibold mb-4">
      {{ $t('landlord.publicProfile.properties') }}
      <span class="text-(--gray) font-normal text-base ml-1">
        ({{ meta.total }})
      </span>
    </h3>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <SkeletonProperty :number-of-items="6" :is-hide="!pending" />

      <NuxtImg
        v-show="items.length === 0 && !pending"
        class="col-span-full m-auto"
        :initial="{ opacity: 0, y: 20, scale: 0.96 }"
        :animate="{ opacity: 1, y: 0, scale: 1 }"
        :transition="{ duration: 0.5, easing: 'ease-out' }"
        src="/not-found.png"
        width="500"
        height="333"
      />

      <PropertyCardView
        v-show="items.length > 0 && !pending"
        v-for="item in cardItems"
        :key="item.id"
        :item="item"
        :is-favourited="isFavourited(item.id)"
        :is-favourite-pending="isToggling(item.id)"
        hide-compare-icon
        image-sizes="100vw sm:50vw lg:33vw"
        @favourite="toggle(item.id)"
      />
    </div>

    <BasePagination
      v-if="meta.totalPages > 1"
      class="mt-6"
      :total="meta.total"
      :page-size="pageSize"
      :current-page="page"
      @update:current-page="$emit('update:page', $event)"
    />
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import PropertyCardView from '~/components/property/PropertyCard.vue'
import BasePagination from '~/components/ui/BasePagination.vue'
import SkeletonProperty from '~/components/animation/skeleton-property.vue'
import { useFavourites } from '~/features/favourite/composable/useFavourites'
import type { PropertyCardViewModel } from '~/types/property-card'
import type { LandlordPropertiesMeta, LandlordPropertyItem } from '../interface/landlord-profile'

const props = defineProps<{
  items: LandlordPropertyItem[]
  meta: LandlordPropertiesMeta
  page: number
  pageSize: number
  pending: boolean
}>()

defineEmits<{
  (e: 'update:page', value: number): void
}>()

const { isFavourited, isToggling, toggle } = useFavourites()

const cardItems = computed<PropertyCardViewModel[]>(() =>
  props.items.map(item => ({
    id: item.id,
    title: item.title,
    monthlyPrice: item.monthly_price,
    totalViews: item.totalViews,
    photoCount: item._count?.images ?? item.images?.length ?? 0,
    bathroom: item.bathroom,
    bedroom: item.bedroom,
    isAvailable: item.isAvailable,
    imageSrc: item.images?.[0]?.imageKey ?? '',
    location: item.district,
    propertyType: item.propertyType,
    sizeSqm: item.sizeSqm,
  })),
)
</script>
