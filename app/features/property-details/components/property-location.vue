<template>
  <section>
    <h2 class="text-xl font-bold text-gray-800 mb-3">{{ $t("property.location.title") }}</h2>
    <div class="text-sm text-gray-600 mb-1">
      {{ property.district[langKey] }}, {{ property.district.province[langKey] }}
    </div>
    <div class="text-sm text-gray-600 mb-3.5">{{ property.address }}</div>

    <!-- Nearby location -->
    <div v-if="property.nearby_location" class="text-sm text-gray-600 mb-3.5">
      <BaseIconClient name="map-pin" :size="14" class="inline text-gray-600" />
      {{ property.nearby_location }}
      <span> · {{ property.distanceKm ? `${property.distanceKm} km` : '~' }}</span>
    </div>

    <!-- Map -->
    <BaseMapClient
      v-if="property.lat != null && property.lng != null"
      :model-value="{ lat: property.lat, lng: property.lng }"
      :readonly="true"
      height="200px"
      :zoom="15"
    />
    <div
      v-else
      class="h-[200px] bg-[#f4f5f7] border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 text-sm font-semibold"
    >
      <BaseIconClient name="map" :size="20" class="mr-2" />
      {{ $t("property.location.title") }}
    </div>

    <a
      v-if="googleMapsUrl"
      :href="googleMapsUrl"
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

// The map SDK is a ~1.3MB chunk (webgl/maplibre). This section sits near the
// bottom of the page, so defer loading it until it actually scrolls into
// view instead of shipping it on every page load.
const BaseMapClient = defineLazyHydrationComponent('visible', () => import('~/components/ui/BaseMap.client.vue'))

const langKey = useLangKey()

const googleMapsUrl = computed(() => {
  if (props.property.lat != null && props.property.lng != null) {
    return `https://www.google.com/maps?q=${props.property.lat},${props.property.lng}`
  }
  return null
})
</script>
