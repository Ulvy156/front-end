import { computed } from 'vue'
import { useAsyncData } from '#imports'

import { useApi } from '~/composables/useApi'
import {
  fetchPropertyTypeOptions,
  type PropertyTypeOption,
} from '../services/browse-properties'

export function usePropertyTypeOptions() {
  const api = useApi()
  const { data, status } = useAsyncData<PropertyTypeOption[]>(
    'property-type-options',
    () => fetchPropertyTypeOptions(api),
    {
      default: () => [],
    },
  )

  return {
    data: computed(() => data.value ?? []),
    isFetching: computed(() => status.value === 'pending'),
  }
}
