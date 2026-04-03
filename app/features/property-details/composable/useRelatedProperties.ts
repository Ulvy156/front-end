import { computed } from 'vue'

import { useAsyncData, useRoute } from '#imports'

import { useApi } from '~/composables/useApi'
import type { PropertyCardItem } from '~/features/browse-properties/interface/property-card-item'
import { fetchRelatedProperties } from '../services/property-details'

export function useRelatedProperties() {
  const api = useApi()
  const route = useRoute()
  const id = computed(() => route.params.id as string)

  const { data, status } = useAsyncData<PropertyCardItem[]>(
    () => `related-properties-${id.value}`,
    () => fetchRelatedProperties(api, id.value),
    {
      watch: [id],
      default: () => [],
    },
  )

  const relatedProperties = computed(() => data.value ?? [])
  const isFetching = computed(() => status.value === 'pending')

  return {
    relatedProperties,
    isFetching,
  }
}
