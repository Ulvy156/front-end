import { computed, onMounted, watch } from 'vue'
import { useAsyncData, useCookie, useRoute, useRuntimeConfig } from '#imports'

import { useApi } from '~/composables/useApi'
import { useSEO } from '~/composables/useSEO'
import { incrementView } from '~/services/increment-view'
import { usePropertyFilterStore } from '~/stores/propertyFilter'
import { fetchPropertyDetails } from '../services/property-details'
import type { PropertyDetail } from '../interface/properties-details'

/**
 * Get property details by id and filter by location.
 *
 * @returns {object} property details
 *
 * @example
 * const { property } = await usePropertyDetails()
 */
export async function usePropertyDetails() {
  const api = useApi()
  const route = useRoute()
  const config = useRuntimeConfig()
  const seo = useSEO()
  const propertyFilter = usePropertyFilterStore()
  const viewedProperties = useCookie<string[]>('viewed_properties', {
    maxAge: 60 * 60 * 6,
    default: () => [],
  })

  const id = computed(() => route.params.id as string)

  onMounted(async () => {
    await incrementView(api, viewedProperties, id.value)
  })

  const { data: property } = await useAsyncData<PropertyDetail>(
    () =>
      fetchPropertyDetails({
        api,
        id: id.value,
        lat: propertyFilter.lat,
        lng: propertyFilter.lng,
      }),
    {
      watch: [id, () => propertyFilter.lat, () => propertyFilter.lng],
    },
  )

  watch(
    property,
    (value) => {
      if (!value) {
        return
      }

      seo.setSEO({
        title: value.title ?? '',
        description: value.description ?? '',
        image: `${config.public.R2_PUB_URL}/${value.images[0]?.imageKey}`,
      })
    },
    { immediate: true },
  )

  return {
    property,
  }
}
