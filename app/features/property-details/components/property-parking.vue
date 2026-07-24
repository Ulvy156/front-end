<template>
  <section>
    <h2 class="text-xl font-bold text-gray-800 mb-3.5">{{ $t("property.parking") }}</h2>
    <div v-if="props.property.parkings?.length" class="flex gap-3.5 flex-wrap">
      <div
        v-for="value in props.property.parkings"
        :key="value.type"
        class="flex-1 min-w-[180px] bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3.5"
      >
        <div class="w-[42px] h-[42px] rounded-lg bg-(--nav-active)/10 flex items-center justify-center">
          <BaseIconClient :name="PARKING_UI[value.type].icon" :size="20" color="var(--nav-active-item)" />
        </div>
        <div>
          <div class="text-[15px] font-semibold text-gray-800">
            {{ PARKING_UI[value.type].label[currentLang] }}
          </div>
          <div class="text-[13px] text-gray-600 mt-0.5">
            {{ value.slots }} {{ currentLang === 'en' ? 'slots' : 'កន្លែង' }}
            · {{ value.isFree ? (currentLang === 'en' ? 'Free' : 'ឥតគិតថ្លៃ') : `$${value.price}/${$t('month')}` }}
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-sm text-gray-600">
      {{ $t("property.parking_desc") }}
    </div>
  </section>
</template>

<script lang="ts" setup>
import BaseIconClient from "~/components/ui/BaseIcon.client.vue"
import type { PropertyDetail } from "../interface/properties-details"
import { PARKING_UI } from "~/config/parking.config"

const props = defineProps<{
  property: PropertyDetail
}>()

const currentLang = useCurrentLang()
</script>
