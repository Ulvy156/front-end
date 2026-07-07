<template>
  <PropertyCardView
    :item="cardItem"
    :hide-compare-icon="hideCompareIcon"
    :is-favourited="isFavourited(props.id)"
    :is-favourite-pending="isToggling(props.id)"
    @favourite="toggle(props.id)"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import PropertyCardView from '~/components/property/PropertyCard.vue'
import { useFavourites } from '~/features/favourite/composable/useFavourites'
import type { PropertyCardViewModel } from '~/types/property-card'

const { isFavourited, isToggling, toggle } = useFavourites()

const props = withDefaults(
  defineProps<{
    id: string
    price: number
    src: string
    title: string
    content: string
    bathroom: number
    bedroom: number
    isAvailable: boolean
    location: {
      nameEn: string
      nameKh: string
      province: {
        nameEn: string
        nameKh: string
      }
    }
    type: {
      nameEn: string
      nameKh: string
      icon: string
    }
    size: number
    totalView: number
    hideCompareIcon?: boolean
  }>(),
  {
    price: 0,
    src: '',
    title: '',
    content: '',
    size: 0,
    totalView: 0,
    hideCompareIcon: false,
  },
)

const cardItem = computed<PropertyCardViewModel>(() => ({
  id: props.id,
  title: props.title,
  content: props.content,
  monthlyPrice: props.price,
  totalViews: props.totalView,
  bathroom: props.bathroom,
  bedroom: props.bedroom,
  isAvailable: props.isAvailable,
  imageSrc: props.src,
  location: props.location,
  propertyType: props.type,
  sizeSqm: props.size,
}))
</script>
