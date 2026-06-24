<template>
  <section v-if="props.property.amenities.length">
    <h2 class="text-xl font-bold text-gray-800 mb-3.5">{{ $t("property.amenity") }}</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-2.5">
      <div
        v-for="value in props.property.amenities"
        :key="value.icon"
        class="flex items-center gap-3 bg-white border border-gray-200 rounded-lg py-3 px-4"
      >
        <span class="w-5.5 h-5.5 rounded-full flex items-center justify-center bg-(--nav-active) shrink-0">
          <BaseIconClient :name="value.icon" :size="13" color="var(--nav-active-item)" />
        </span>
        <span class="text-sm text-gray-500">{{ value[currentKey] }}</span>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import BaseIconClient from "~/components/ui/BaseIcon.client.vue"
import type { PropertyDetail } from "../interface/properties-details"

const props = defineProps<{
  property: PropertyDetail
}>()

const currentKey = useLangKey()
</script>
