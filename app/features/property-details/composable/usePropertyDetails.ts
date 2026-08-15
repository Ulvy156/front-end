import { computed, watch } from 'vue'
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
 * Deliberately not awaited: a top-level await here would make the page's
 * async setup block Suspense, leaving the previous route's page on screen
 * (URL already changed) until the fetch resolves. Callers must guard on
 * `pending`/`property` instead.
 *
 * @returns {object} property details
 *
 * @example
 * const { property, pending } = usePropertyDetails()
 */
export function usePropertyDetails() {
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

  // Key must be reactive to `id` (not a static string) — otherwise every
  // property id shares one cache slot, and Nuxt's payload cache can hand
  // back a previous property's frozen data instead of refetching.
  const { data: property, pending } = useAsyncData<PropertyDetail>(
    () => `property-details-${id.value}`,
    () =>
      fetchPropertyDetails({
        api,
        id: id.value,
        lat: propertyFilter.lat,
        lng: propertyFilter.lng,
      }),
    {
      watch: [() => propertyFilter.lat, () => propertyFilter.lng],
    },
  )

  watch(
    property,
    (value) => {
      if (!value) {
        return
      }

      const firstImageKey = value.images[0]?.imageKey
      const description = value.description ?? ''

      seo.setSEO({
        title: value.title ?? '',
        // Social previews (Telegram, Facebook, ...) truncate long descriptions
        // poorly, so cut it to a clean summary-length snippet ourselves.
        description: description.length > 160 ? `${description.slice(0, 157)}...` : description,
        image: firstImageKey
          ? `${config.public.R2_PUB_URL}/${firstImageKey}`
          : `${config.public.BASE_URL}/sabayrent-logo.webp`,
      })
    },
    { immediate: true },
  )

  watch(
    id,
    (value) => {
      incrementView(api, viewedProperties, value)
    },
    { immediate: true },
  )

  return {
    property,
    pending,
  }
}
