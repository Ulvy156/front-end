<template>
  <div class="p-5 border border-gray rounded-(--radius) bg-white">
    <div class="flex items-center gap-x-2">
      <BaseIconClient name="map-pin" size="20" />
      <h3>{{ $t("property.location.title") }}</h3>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
      <!-- city or province -->
      <div>
        <p class="text-(--gray)" style="font-size: 13px">
          {{ $t("property.location.province") }} /
          {{ $t("property.location.city") }}
        </p>
        <p class="font-semibold" style="font-size: 16px">
          {{ property.district.province.nameEn }} / {{ property.district.province.nameKh }}
        </p>
      </div>
      <!-- district -->
      <div>
        <p class="text-(--gray)" style="font-size: 13px">
          {{ $t("property.location.district") }} /
          {{ $t("property.location.khan") }}
        </p>
        <p class="font-semibold" style="font-size: 16px">
          {{ property.district.nameEn }} / {{ property.district.nameKh }}
        </p>
      </div>
      <!-- address -->
      <div >
        <p class="text-(--gray)" style="font-size: 13px">
          {{ $t("property.location.address") }}
        </p>
        <p>{{ property.address }}</p>
      </div>
       <!-- distance -->
      <div >
        <p class="text-(--gray)" style="font-size: 13px">
          {{ $t("property.location.distance") }}
        </p>
        <p class="font-semibold" style="font-size: 16px">
          {{ property.distanceKm }} KM
        </p>
      </div>
      <!-- nearby -->
      <div class="border-l-4 border-(--nav-active-item) rounded-(--radius) p-3 bg-(--bg-gray) col-span-1 md:col-span-2">
        <p class="text-(--gray)" style="font-size: 13px">
          {{ $t("property.location.nearby_address") }}
        </p>
        <p class="col-span-2">{{ nearBy }}</p>
      </div>
    </div>
    <div id="map"></div>
  </div>
</template>

<script lang="ts" setup>
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import type { PropertyDetail } from "../interface/properties-details";

const props = defineProps<{
  property: PropertyDetail;
}>();

const nearBy = computed(() => props.property.nearby_location ?? 'N/A');

</script>
