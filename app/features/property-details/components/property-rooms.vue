<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3.5">
    <div v-for="fact in facts" :key="fact.label" class="key-fact">
      <div class="flex items-center gap-1.5 mb-2">
        <BaseIconClient :name="fact.icon" :size="15" class="text-gray-500" />
        <span class="text-[11px] uppercase tracking-wider text-gray-600 font-semibold">
          {{ fact.label }}
        </span>
      </div>
      <div class="text-xl font-bold text-gray-800">{{ fact.value }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BaseIconClient from "~/components/ui/BaseIcon.client.vue"
import type { PropertyDetail } from "../interface/properties-details"

const { t } = useI18n()
const currentLang = useCurrentLang()

const props = defineProps<{
  property: PropertyDetail
}>()

const facts = computed(() => {
  const items = [
    { icon: 'bed', label: t('property.bedroom'), value: String(props.property.bedroom) },
    { icon: 'shower-head', label: t('property.bathroom'), value: String(props.property.bathroom) },
    { icon: 'ruler', label: t('property.size'), value: `${props.property.sizeSqm} m²` },
    { icon: 'layers', label: t('property.floor'), value: `${props.property.floor} / ${props.property.totalFloors}` },
    { icon: 'sofa', label: t('property.furnishing'), value: props.property.furnished ? t('property.furnished') : t('property.unfurnished') },
    { icon: 'calendar', label: t('property.price.lease'), value: formatDuration(props.property.minimumStayLength, currentLang.value) },
    { icon: 'calendar-check', label: t('property.price.available'), value: formatDateLong(props.property.availableFrom, currentLang.value) },
  ]
  if (props.property.openTime && props.property.closeTime) {
    items.push({ icon: 'clock', label: t('property.operating_hours'), value: `${props.property.openTime} - ${props.property.closeTime}` })
  }
  return items
})
</script>

<style scoped>
.key-fact {
  background: #f4f5f7;
  border-left: 3px solid var(--nav-active-item);
  border-radius: 12px;
  padding: 16px 18px;
}
</style>
