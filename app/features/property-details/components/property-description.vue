<template>
  <section>
    <h2 class="text-xl font-bold text-gray-800 mb-3">{{ $t("property.desc") }}</h2>
    <p class="text-[15px] leading-relaxed text-gray-500 m-0">{{ property.description }}</p>
  </section>
</template>

<script lang="ts" setup>
import type { PropertyDetail } from "../interface/properties-details"

const props = defineProps<{
  property: PropertyDetail
}>()
</script>
