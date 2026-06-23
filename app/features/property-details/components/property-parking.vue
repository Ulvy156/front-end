<template>
  <div class="p-5 border border-gray rounded-(--radius) bg-white">
    <div class="flex items-center gap-x-2">
      <BaseIconClient name="circle-parking" size="20" />
      <h3>{{ $t("property.parking") }}</h3>
    </div>
    <div v-if="props.property.parkings?.length"
    class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
      <article
        class="bg-(--bg-gray) p-3 rounded-(--radius) w-fit"
        v-for="value in props.property.parkings"
      >
        <!-- name -->
        <div class="flex items-center gap-x-2 mb-2">
          <BaseIconClient :name="PARKING_UI[value.type].icon" />
          <p>{{ PARKING_UI[value.type].label[currentLang] }}</p>
        </div>

        <div class="flex items-center gap-x-4">
          <span
            :class="value.isFree ? 'bg-(--nav-active-item)' : 'bg-(--warning)'"
            class="text-(--warning-foreground) py-1 px-2 rounded-(--radius)"
          >
            {{
              value.isFree
                ? freeLabel[currentLang].free
                : freeLabel[currentLang].paid
            }}
          </span>

          <!-- price -->
          <p v-if="!value.isFree">
            ${{ value.price }} / {{ $t("property.month") }}
          </p>
          <!-- slot -->
          <div class="flex items-center gap-x-2 text-(--gray)">
            <span>
              {{ value.slots }}
              {{ currentLang === "en" ? "parking spaces" : "កន្លែងចត" }}
            </span>
          </div>
        </div>
      </article>
    </div>
    <span class="text-(--gray)" v-else>
      {{ $t("property.parking_desc") }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import type { PropertyDetail } from "../interface/properties-details";
import { PARKING_UI } from "~/config/parking.config";

const props = defineProps<{
  property: PropertyDetail;
}>();

const currentLang = useCurrentLang();
const freeLabel = {
  en: {
    free: "Free",
    paid: "Paid",
  },
  km: {
    free: "ឥតគិតថ្លៃ",
    paid: "គិតថ្លៃ",
  },
};
</script>
