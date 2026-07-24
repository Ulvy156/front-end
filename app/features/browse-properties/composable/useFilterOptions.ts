import { computed } from 'vue'
import { useAsyncData } from '#imports'

import { useApi } from '~/composables/useApi'
import {
  fetchPropertyAmenityOptions,
  fetchPropertyRuleOptions,
  fetchPropertyTypeOptions,
  type PropertyAmenityOption,
  type PropertyRuleOption,
  type PropertyTypeOption,
} from '../services/browse-properties'

interface FilterOptionsData {
  propertyTypes: PropertyTypeOption[]
  amenities: PropertyAmenityOption[]
  rules: PropertyRuleOption[]
}

export function useFilterOptions() {
  const api = useApi()
  const { data, status } = useAsyncData<FilterOptionsData>(
    'filter-options',
    async () => {
      const [propertyTypes, amenities, rules] = await Promise.all([
        fetchPropertyTypeOptions(api),
        fetchPropertyAmenityOptions(api),
        fetchPropertyRuleOptions(api),
      ])

      return { propertyTypes, amenities, rules }
    },
    {
      default: () => ({ propertyTypes: [], amenities: [], rules: [] }),
    },
  )

  return {
    propertyTypes: computed(() => data.value?.propertyTypes ?? []),
    amenities: computed(() => data.value?.amenities ?? []),
    rules: computed(() => data.value?.rules ?? []),
    isFetching: computed(() => status.value === 'pending'),
  }
}
