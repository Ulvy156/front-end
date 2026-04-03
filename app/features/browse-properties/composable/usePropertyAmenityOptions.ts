import { computed } from 'vue'
import { useAsyncData } from '#imports'

import { useApi } from '~/composables/useApi'
import {
  fetchPropertyAmenityOptions,
  type PropertyAmenityOption,
} from '../services/browse-properties'

export function usePropertyAmenityOptions() {
  const api = useApi()
  const { data, status } = useAsyncData<PropertyAmenityOption[]>(
    'property-amenity-options',
    () => fetchPropertyAmenityOptions(api),
    {
      default: () => [],
    },
  )

  return {
    data: computed(() => data.value ?? []),
    isFetching: computed(() => status.value === 'pending'),
  }
}
