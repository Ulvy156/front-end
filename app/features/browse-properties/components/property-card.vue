<template>
  <PropertyCardView
    :item="cardItem"
    :hide-compare-icon="hideCompareIcon"
    :is-favourited="isFavourited(props.item.id)"
    :is-favourite-pending="isToggling(props.item.id)"
    image-class="w-full object-cover aspect-16/5"
    @compare="handleCompare"
    @favourite="toggle(props.item.id)"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import PropertyCardView from '~/components/property/PropertyCard.vue'
import { useMessage } from '~/composables/useMessage'
import { useCompareProperty } from '~/stores/useCompareProperty'
import { useFavourites } from '~/features/favourite/composable/useFavourites'
import type { PropertyCardViewModel } from '~/types/property-card'
import type { PropertyCardItem } from '../interface/property-card-item'

const props = withDefaults(
  defineProps<{
    item: PropertyCardItem
    hideCompareIcon?: boolean
  }>(),
  {
    hideCompareIcon: false,
  },
)

const emit = defineEmits<{
  (e: 'compare', value: boolean): void
  (e: 'heart', value: boolean): void
}>()

const compareStore = useCompareProperty()
const { showMessage } = useMessage()
const { t } = useI18n()
const { isFavourited, isToggling, toggle } = useFavourites()

const cardItem = computed<PropertyCardViewModel>(() => ({
  id: props.item.id,
  title: props.item.title,
  monthlyPrice: props.item.monthly_price,
  totalViews: props.item.totalViews,
  bathroom: props.item.bathroom,
  bedroom: props.item.bedroom,
  isAvailable: props.item.isAvailable,
  imageSrc: props.item.images?.[0]?.imageKey ?? '',
  location: props.item.district,
  propertyType: props.item.propertyType,
  sizeSqm: props.item.sizeSqm,
  distanceKm: props.item.distanceKm,
}))

function handleCompare() {
  if (compareStore.propertyCardItem.length === 4) {
    return showMessage(
      t('property.compare.limit_compare'),
      'warning',
      'bottom-right',
    )
  }

  if (compareStore.isItemExist(props.item.id)) {
    return showMessage(
      t('property.compare.duplicate'),
      'warning',
      'bottom-right',
    )
  }

  compareStore.addItem(props.item)
  emit('compare', true)
}
</script>
