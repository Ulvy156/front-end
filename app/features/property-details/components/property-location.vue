<template>
  <section>
    <h2 class="text-xl font-bold text-gray-800 mb-3">{{ $t("property.location.title") }}</h2>
    <div class="text-sm text-gray-500 mb-1">
      {{ property.district[langKey] }}, {{ property.district.province[langKey] }}
    </div>
    <div class="text-sm text-gray-400 mb-3.5">{{ property.address }}</div>

    <!-- Nearby location -->
    <div v-if="property.nearby_location" class="text-sm text-gray-400 mb-3.5">
      <BaseIconClient name="map-pin" :size="14" class="inline text-gray-400" />
      {{ property.nearby_location }}
      <span v-if="property.distanceKm"> · {{ property.distanceKm }} km</span>
    </div>

    <!-- Map placeholder -->
    <div class="h-[200px] bg-[#f4f5f7] border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm font-semibold">
      <BaseIconClient name="map" :size="20" class="mr-2" />
      {{ $t("property.location.title") }}
    </div>

    <a
      v-if="property.locationUrl"
      :href="property.locationUrl"
      target="_blank"
      class="inline-block mt-3 text-[13px] text-(--nav-active-item) font-semibold no-underline"
    >
      {{ $t('property.location.open_map') || 'Open in Google Maps' }} →
    </a>
  </section>
</template>

<script lang="ts" setup>
import BaseIconClient from "~/components/ui/BaseIcon.client.vue"
import type { PropertyDetail } from "../interface/properties-details"

const props = defineProps<{
  property: PropertyDetail
}>()

const langKey = useLangKey()
</script>
